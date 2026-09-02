const express = require("express");

const {
  getAllOrders,
  updateOrderStatus,
  adminLogin,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Admin: view all orders
router.get("/orders", protect, adminOnly, getAllOrders);

// Admin: update order status
router.patch(
  "/orders/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;