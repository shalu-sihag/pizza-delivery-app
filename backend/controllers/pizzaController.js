const Pizza = require("../models/Pizza");


// ==============================
// GET ALL PIZZAS
// ==============================

const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pizzas.length,
      pizzas,
    });
  } catch (error) {
    console.error("Get pizzas error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching pizzas",
    });
  }
};


// ==============================
// GET PIZZA BY ID
// ==============================

const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    return res.status(200).json({
      success: true,
      pizza,
    });
  } catch (error) {
    console.error("Get pizza error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching pizza",
    });
  }
};


// ==============================
// CREATE PIZZA
// ==============================

const createPizza = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      description,
      category,
      isAvailable,
    } = req.body;

    if (!name || price === undefined || !image || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, image, description and category are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (!["veg", "non-veg"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Category must be either veg or non-veg",
      });
    }

    const pizza = await Pizza.create({
      name: name.trim(),
      price,
      image,
      description: description.trim(),
      category,
      isAvailable:
        isAvailable === undefined ? true : isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Pizza created successfully",
      pizza,
    });
  } catch (error) {
    console.error("Create pizza error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating pizza",
    });
  }
};

// ==============================
// UPDATE PIZZA
// ==============================

const updatePizza = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      image,
      description,
      category,
      isAvailable,
    } = req.body;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (
      category !== undefined &&
      !["veg", "non-veg"].includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must be either veg or non-veg",
      });
    }

    if (name !== undefined) {
      pizza.name = name.trim();
    }

    if (price !== undefined) {
      pizza.price = price;
    }

    if (image !== undefined) {
      pizza.image = image;
    }

    if (description !== undefined) {
      pizza.description = description.trim();
    }

    if (category !== undefined) {
      pizza.category = category;
    }

    if (isAvailable !== undefined) {
      pizza.isAvailable = isAvailable;
    }

    await pizza.save();

    return res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      pizza,
    });
  } catch (error) {
    console.error("Update pizza error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating pizza",
    });
  }
};


// ==============================
// DELETE PIZZA
// ==============================

const deletePizza = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    await Pizza.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Pizza deleted successfully",
    });
  } catch (error) {
    console.error("Delete pizza error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting pizza",
    });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};