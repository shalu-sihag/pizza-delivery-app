const express = require("express");

const {
  getCustomizations,
  getCustomizationsByType,
  createCustomization,
  updateCustomization,
  deleteCustomization,
} = require("../controllers/customizationController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();


// Public routes

router.get("/", getCustomizations);

router.get("/:type", getCustomizationsByType);


// Admin routes

router.post("/", protect, admin, createCustomization);

router.put("/:id", protect, admin, updateCustomization);

router.delete("/:id", protect, admin, deleteCustomization);


module.exports = router;