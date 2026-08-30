const Customization = require("../models/Customization");


// ========================================
// GET ALL CUSTOMIZATION OPTIONS
// ========================================

const getCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find({
      isAvailable: true,
    }).sort({ type: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: customizations.length,
      customizations,
    });
  } catch (error) {
    console.error("Get customizations error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching customization options",
    });
  }
};


// ========================================
// GET CUSTOMIZATIONS BY TYPE
// ========================================

const getCustomizationsByType = async (req, res) => {
  try {
    const { type } = req.params;

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
          "Invalid customization type. Use base, sauce, cheese or vegetable",
      });
    }

    const customizations = await Customization.find({
      type,
      isAvailable: true,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: customizations.length,
      type,
      customizations,
    });
  } catch (error) {
    console.error("Get customizations by type error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching customization options",
    });
  }
};


// ========================================
// CREATE CUSTOMIZATION
// ADMIN ONLY
// ========================================

const createCustomization = async (req, res) => {
  try {
    const {
      type,
      name,
      price,
      isAvailable,
    } = req.body;

    if (!type || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Type, name and price are required",
      });
    }

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
          "Type must be base, sauce, cheese or vegetable",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    const customization = await Customization.create({
      type,
      name: name.trim(),
      price,
      isAvailable:
        isAvailable === undefined ? true : isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Customization created successfully",
      customization,
    });
  } catch (error) {
    console.error("Create customization error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating customization",
    });
  }
};


// ========================================
// UPDATE CUSTOMIZATION
// ADMIN ONLY
// ========================================

const updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      name,
      price,
      isAvailable,
    } = req.body;

    const customization = await Customization.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found",
      });
    }

    if (
      type !== undefined &&
      !["base", "sauce", "cheese", "vegetable"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customization type",
      });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (type !== undefined) {
      customization.type = type;
    }

    if (name !== undefined) {
      customization.name = name.trim();
    }

    if (price !== undefined) {
      customization.price = price;
    }

    if (isAvailable !== undefined) {
      customization.isAvailable = isAvailable;
    }

    await customization.save();

    return res.status(200).json({
      success: true,
      message: "Customization updated successfully",
      customization,
    });
  } catch (error) {
    console.error("Update customization error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating customization",
    });
  }
};


// ========================================
// DELETE CUSTOMIZATION
// ADMIN ONLY
// ========================================

const deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;

    const customization = await Customization.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found",
      });
    }

    await Customization.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Customization deleted successfully",
    });
  } catch (error) {
    console.error("Delete customization error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting customization",
    });
  }
};


module.exports = {
  getCustomizations,
  getCustomizationsByType,
  createCustomization,
  updateCustomization,
  deleteCustomization,
};