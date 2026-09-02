const express = require("express");

const {
  getInventory,
  getInventoryItem,
  addInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventoryController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================
// ADMIN INVENTORY ROUTES
// ========================================

// Get all inventory
router.get("/", protect, admin, getInventory);

// Get single inventory item
router.get("/:id", protect, admin, getInventoryItem);

// Add inventory item
router.post("/", protect, admin, addInventory);

// Update stock / threshold
router.put("/:id", protect, admin, updateInventory);

// Delete inventory item
router.delete("/:id", protect, admin, deleteInventory);


module.exports = router;