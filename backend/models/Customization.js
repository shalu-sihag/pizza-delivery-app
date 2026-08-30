const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["base", "sauce", "cheese", "vegetable"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customization = mongoose.model(
  "Customization",
  customizationSchema
);

module.exports = Customization;