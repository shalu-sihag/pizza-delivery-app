const mongoose = require("mongoose");

const Order = require("../models/Order");

const {
  calculateRegularPizzaPrice,
  calculateCustomPizzaPrice,
} = require("../services/orderService");

const {
  checkCustomPizzaInventory,
  decreaseCustomPizzaInventory,
} = require("../services/inventoryService");


// ========================================
// CREATE ORDER
// ========================================

const createOrder = async (req, res) => {
  try {
    // Only normal users can create orders
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can create orders",
      });
    }

    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (
      !deliveryAddress ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const processedItems = [];

    let totalAmount = 0;


    // ========================================
    // PROCESS ORDER ITEMS
    // ========================================

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a positive integer",
        });
      }


      // ========================================
      // REGULAR PIZZA
      // ========================================

      if (item.pizzaId) {
        if (!mongoose.Types.ObjectId.isValid(item.pizzaId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid pizza ID",
          });
        }

        const pizza = await calculateRegularPizzaPrice(
          item.pizzaId
        );

        const itemTotal = pizza.price * quantity;

        processedItems.push({
          pizza: pizza._id,
          name: pizza.name,
          price: pizza.price,
          quantity,
          isCustomPizza: false,
        });

        totalAmount += itemTotal;
      }


      // ========================================
      // CUSTOM PIZZA
      // ========================================

      else if (item.customPizza) {
        const customPizza =
          await calculateCustomPizzaPrice(
            item.customPizza
          );

        // Check inventory
        await checkCustomPizzaInventory(
          customPizza,
          quantity
        );

        const itemTotal =
          customPizza.price * quantity;

        processedItems.push({
          pizza: null,
          name: "Custom Pizza",
          price: customPizza.price,
          quantity,
          isCustomPizza: true,

          customization: {
            base: customPizza.base._id,
            sauce: customPizza.sauce._id,
            cheese: customPizza.cheese._id,
            vegetables:
              customPizza.vegetables.map(
                (vegetable) => vegetable._id
              ),
          },
        });

        totalAmount += itemTotal;
      }


      // ========================================
      // INVALID ITEM
      // ========================================

      else {
        return res.status(400).json({
          success: false,
          message:
            "Each order item must contain either pizzaId or customPizza",
        });
      }
    }


    // ========================================
    // CREATE ORDER
    // ========================================

    const order = await Order.create({
      user: req.user._id,
      items: processedItems,
      totalAmount,
      deliveryAddress: deliveryAddress.trim(),
      status: "Order Received",
      paymentStatus: "Pending",
    });

    // Inventory is deducted only after payment succeeds.

    return res.status(201).json({
      success: true,
      message:
        "Order created successfully. Payment is pending.",
      order,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Error while creating order",
    });
  }
};


// ========================================
// MOCK PAYMENT
// ========================================

const processMockPayment = async (req, res) => {
  try {
    // Only normal users can make payments
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can make payments",
      });
    }

    const { id } = req.params;
    const { paymentSuccess } = req.body;


    // ========================================
    // VALIDATE ORDER ID
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }


    // ========================================
    // VALIDATE PAYMENT RESULT
    // ========================================

    if (typeof paymentSuccess !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "paymentSuccess must be a boolean value",
      });
    }


    // ========================================
    // FIND ORDER
    // ========================================

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("items.customization.base")
      .populate("items.customization.sauce")
      .populate("items.customization.cheese")
      .populate("items.customization.vegetables");


    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    // ========================================
    // PREVENT DUPLICATE PAYMENT
    // ========================================

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order has already been paid",
      });
    }

    if (order.paymentStatus === "Failed") {
      return res.status(400).json({
        success: false,
        message:
          "Payment for this order has already failed",
      });
    }


    // ========================================
    // PAYMENT FAILURE
    // ========================================

    if (!paymentSuccess) {
      order.paymentStatus = "Failed";
      order.paymentId = `MOCK_FAILED_${Date.now()}`;

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Mock payment failed",
        paymentStatus: order.paymentStatus,
        paymentId: order.paymentId,
        order,
      });
    }


    // ========================================
    // PAYMENT SUCCESS
    // ========================================

    // Check inventory again before deducting it.

    for (const item of order.items) {
      if (!item.isCustomPizza) {
        continue;
      }

      const customPizza = {
        base: item.customization.base,
        sauce: item.customization.sauce,
        cheese: item.customization.cheese,
        vegetables: item.customization.vegetables,
      };

      await checkCustomPizzaInventory(
        customPizza,
        item.quantity
      );
    }


    // ========================================
    // DEDUCT INVENTORY
    // ========================================

    for (const item of order.items) {
      if (!item.isCustomPizza) {
        continue;
      }

      const customPizza = {
        base: item.customization.base,
        sauce: item.customization.sauce,
        cheese: item.customization.cheese,
        vegetables: item.customization.vegetables,
      };

      await decreaseCustomPizzaInventory(
        customPizza,
        item.quantity
      );
    }


    // ========================================
    // MARK ORDER AS PAID
    // ========================================

    const mockPaymentId =
      `MOCK_PAY_${Date.now()}`;

    order.paymentStatus = "Paid";
    order.paymentId = mockPaymentId;
    order.razorpayOrderId = null;

    await order.save();


    // ========================================
    // SUCCESS RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message:
        "Mock payment successful and order confirmed",
      paymentStatus: order.paymentStatus,
      paymentId: order.paymentId,
      razorpayOrderId: order.razorpayOrderId,
      order,
    });

  } catch (error) {
    console.error("Mock payment error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Payment could not be completed",
    });
  }
};


// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can access their orders",
      });
    }

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.pizza")
      .populate("items.customization.base")
      .populate("items.customization.sauce")
      .populate("items.customization.cheese")
      .populate("items.customization.vegetables")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
    });
  }
};


// ========================================
// GET SINGLE MY ORDER
// ========================================

const getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("items.pizza")
      .populate("items.customization.base")
      .populate("items.customization.sauce")
      .populate("items.customization.cheese")
      .populate("items.customization.vegetables");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching order",
    });
  }
};


// ========================================
// ADMIN - GET ALL ORDERS
// ========================================

const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.pizza")
      .populate("items.customization.base")
      .populate("items.customization.sauce")
      .populate("items.customization.cheese")
      .populate("items.customization.vegetables")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching all orders",
    });
  }
};


// ========================================
// ADMIN - UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;


    // ========================================
    // VALIDATE ORDER ID
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }


    // ========================================
    // VALIDATE STATUS
    // ========================================

    const allowedStatuses = [
      "Order Received",
      "In Kitchen",
      "Sent to Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use Order Received, In Kitchen, Sent to Delivery, Delivered or Cancelled",
      });
    }


    // ========================================
    // FIND ORDER
    // ========================================

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    // ========================================
    // PREVENT INVALID UPDATES
    // ========================================

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled orders cannot be updated",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message:
          "Delivered orders cannot be updated",
      });
    }


    // ========================================
    // PAYMENT CHECK
    // ========================================

    if (
      status !== "Cancelled" &&
      order.paymentStatus !== "Paid"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only paid orders can be moved to kitchen or delivery",
      });
    }


    // ========================================
    // UPDATE STATUS
    // ========================================

    order.status = status;

    await order.save();


    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
    });
  }
};


// ========================================
// EXPORTS
// ========================================

module.exports = {
  createOrder,
  processMockPayment,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
};