const express = require("express");

const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getAllPizzas);

router.get("/:id", getPizzaById);

// Admin
router.post("/", protect, admin, createPizza);

router.put("/:id", protect, admin, updatePizza);

router.delete("/:id", protect, admin, deletePizza);

module.exports = router;