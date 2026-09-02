const mongoose = require("mongoose");

const Inventory = require("../models/Inventory");


// ========================================
// GET ALL INVENTORY
// ADMIN ONLY
// ========================================

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({
      type: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching inventory",
    });
  }
};


// ========================================
// GET SINGLE INVENTORY ITEM
// ADMIN ONLY
// ========================================

const getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      inventory: item,
    });
  } catch (error) {
    console.error("Get inventory item error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching inventory item",
    });
  }
};


// ========================================
// ADD INVENTORY ITEM
// ADMIN ONLY
// ========================================

const addInventory = async (req, res) => {
  try {
    const {
      type,
      name,
      quantity,
      lowStockThreshold,
    } = req.body;

    // ========================================
    // REQUIRED FIELDS
    // ========================================

    if (!type || !name) {
      return res.status(400).json({
        success: false,
        message: "Type and name are required",
      });
    }

    // ========================================
    // VALID TYPE
    // ========================================

    const allowedTypes = [
      "base",
      "sauce",
      "cheese",
      "vegetable",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid type. Allowed types: base, sauce, cheese, vegetable",
      });
    }

    // ========================================
    // VALID NAME
    // ========================================

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be a valid string",
      });
    }

    // ========================================
    // VALID QUANTITY
    // ========================================

    if (
      quantity !== undefined &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a non-negative integer",
      });
    }

    // ========================================
    // VALID LOW STOCK THRESHOLD
    // ========================================

    if (
      lowStockThreshold !== undefined &&
      (!Number.isInteger(lowStockThreshold) ||
        lowStockThreshold < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "lowStockThreshold must be a non-negative integer",
      });
    }

    // ========================================
    // CHECK DUPLICATE
    // ========================================

    const existingItem = await Inventory.findOne({
      type,
      name: name.trim(),
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message:
          "Inventory item with this type and name already exists",
      });
    }

    // ========================================
    // CREATE INVENTORY ITEM
    // ========================================

    const inventory = await Inventory.create({
      type,
      name: name.trim(),
      quantity:
        quantity !== undefined ? quantity : 0,
      lowStockThreshold:
        lowStockThreshold !== undefined
          ? lowStockThreshold
          : 10,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      inventory,
    });
  } catch (error) {
    console.error("Add inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding inventory item",
    });
  }
};


// ========================================
// UPDATE STOCK
// ADMIN ONLY
// ========================================

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      quantity,
      lowStockThreshold,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    if (
      quantity === undefined &&
      lowStockThreshold === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity or lowStockThreshold is required",
      });
    }

    if (
      quantity !== undefined &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a non-negative integer",
      });
    }

    if (
      lowStockThreshold !== undefined &&
      (!Number.isInteger(lowStockThreshold) ||
        lowStockThreshold < 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "lowStockThreshold must be a non-negative integer",
      });
    }

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (quantity !== undefined) {
      item.quantity = quantity;
    }

    if (lowStockThreshold !== undefined) {
      item.lowStockThreshold = lowStockThreshold;
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory: item,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating inventory",
    });
  }
};


// ========================================
// DELETE INVENTORY ITEM
// ADMIN ONLY
// ========================================

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const item = await Inventory.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Delete inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting inventory item",
    });
  }
};


module.exports = {
  getInventory,
  getInventoryItem,
  addInventory,
  updateInventory,
  deleteInventory,
};