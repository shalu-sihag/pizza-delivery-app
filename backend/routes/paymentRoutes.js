const express = require("express");

const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE TEST PAYMENT
// ========================================

router.post(
  "/create",
  protect,
  createRazorpayOrder
);


// ========================================
// VERIFY TEST PAYMENT
// ========================================

router.post(
  "/verify",
  protect,
  verifyPayment
);


module.exports = router;