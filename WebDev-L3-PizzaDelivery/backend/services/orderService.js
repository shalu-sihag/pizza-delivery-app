const mongoose = require("mongoose");

const Pizza = require("../models/Pizza");
const Customization = require("../models/Customization");


// Calculate the price of a regular pizza
const calculateRegularPizzaPrice = async (pizzaId) => {
  if (!mongoose.Types.ObjectId.isValid(pizzaId)) {
    throw new Error("Invalid pizza ID");
  }

  const pizza = await Pizza.findOne({
    _id: pizzaId,
    isAvailable: true,
  });

  if (!pizza) {
    throw new Error("Pizza not found or unavailable");
  }

  return pizza;
};


// Calculate the price of a custom pizza
const calculateCustomPizzaPrice = async (customPizza) => {
  const {
    baseId,
    sauceId,
    cheeseId,
    vegetableIds = [],
  } = customPizza;

  // Validate required IDs
  if (
    !baseId ||
    !sauceId ||
    !cheeseId
  ) {
    throw new Error(
      "Base, sauce and cheese are required for custom pizza"
    );
  }

  // Validate ObjectIds
  const idsToValidate = [
    baseId,
    sauceId,
    cheeseId,
    ...vegetableIds,
  ];

  for (const id of idsToValidate) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customization ID");
    }
  }

  // Fetch base, sauce and cheese
  const base = await Customization.findOne({
    _id: baseId,
    type: "base",
    isAvailable: true,
  });

  const sauce = await Customization.findOne({
    _id: sauceId,
    type: "sauce",
    isAvailable: true,
  });

  const cheese = await Customization.findOne({
    _id: cheeseId,
    type: "cheese",
    isAvailable: true,
  });

  if (!base) {
    throw new Error("Selected base not found or unavailable");
  }

  if (!sauce) {
    throw new Error("Selected sauce not found or unavailable");
  }

  if (!cheese) {
    throw new Error("Selected cheese not found or unavailable");
  }

  // Fetch vegetables
  const vegetables = await Customization.find({
    _id: { $in: vegetableIds },
    type: "vegetable",
    isAvailable: true,
  });

  // Make sure every requested vegetable exists
  if (vegetables.length !== vegetableIds.length) {
    throw new Error(
      "One or more selected vegetables are invalid or unavailable"
    );
  }

  // Calculate server-side price
  const totalPrice =
    base.price +
    sauce.price +
    cheese.price +
    vegetables.reduce(
      (total, vegetable) => total + vegetable.price,
      0
    );

  return {
    price: totalPrice,
    base,
    sauce,
    cheese,
    vegetables,
  };
};


module.exports = {
  calculateRegularPizzaPrice,
  calculateCustomPizzaPrice,
};