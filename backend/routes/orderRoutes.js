const express = require("express");

const {
  createOrder,
  processMockPayment,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();


// ========================================
// USER ORDER ROUTES
// ========================================

// Create order
router.post(
  "/",
  protect,
  createOrder
);

// Mock payment
router.post(
  "/:id/pay",
  protect,
  processMockPayment
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);


// ========================================
// ADMIN ORDER ROUTES
// ========================================

// Get all orders
router.get(
  "/admin/all",
  protect,
  admin,
  getAllOrders
);

// Update order status
router.put(
  "/admin/:id/status",
  protect,
  admin,
  updateOrderStatus
);


// ========================================
// SINGLE USER ORDER
// ========================================

// Get single order
router.get(
  "/:id",
  protect,
  getMyOrderById
);


module.exports = router;