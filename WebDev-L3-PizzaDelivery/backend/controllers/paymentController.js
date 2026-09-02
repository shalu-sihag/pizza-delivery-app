const Order = require("../models/Order");


// ========================================
// CREATE TEST PAYMENT
// ========================================

const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test payment created successfully",
      payment: {
        orderId: order._id,
        amount: order.totalAmount,
        currency: "INR",
        paymentMode: "TEST",
      },
    });
  } catch (error) {
    console.error("Create test payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create test payment",
    });
  }
};


// ========================================
// VERIFY TEST PAYMENT
// ========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentStatus,
    } = req.body;

    if (!orderId || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Order ID and payment status are required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }


    // ========================================
    // TEST PAYMENT SUCCESS
    // ========================================

    if (paymentStatus === "success") {
      order.paymentStatus = "Paid";
      order.paymentId = `TEST_PAYMENT_${Date.now()}`;

      await order.save();

      return res.status(200).json({
        success: true,
        message: "Test payment successful",
        order,
      });
    }


    // ========================================
    // TEST PAYMENT FAILURE
    // ========================================

    if (paymentStatus === "failed") {
      order.paymentStatus = "Failed";

      await order.save();

      return res.status(200).json({
        success: false,
        message: "Test payment failed",
        order,
      });
    }


    return res.status(400).json({
      success: false,
      message: "Invalid payment status",
    });

  } catch (error) {
    console.error("Test payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while processing test payment",
    });
  }
};


module.exports = {
  createRazorpayOrder,
  verifyPayment,
};