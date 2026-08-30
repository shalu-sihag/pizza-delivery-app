const Inventory = require("../models/Inventory");


// ========================================
// CHECK INVENTORY AVAILABILITY
// ========================================

const checkInventory = async (type, name, quantity) => {
  const inventoryItem = await Inventory.findOne({
    type,
    name,
  });

  if (!inventoryItem) {
    throw new Error(
      `Inventory item not found: ${type} - ${name}`
    );
  }

  if (inventoryItem.quantity < quantity) {
    throw new Error(
      `Insufficient stock for ${name}. Available: ${inventoryItem.quantity}`
    );
  }

  return true;
};


// ========================================
// DECREASE INVENTORY
// ========================================

const decreaseInventory = async (type, name, quantity) => {
  const inventoryItem = await Inventory.findOne({
    type,
    name,
  });

  if (!inventoryItem) {
    throw new Error(
      `Inventory item not found: ${type} - ${name}`
    );
  }

  if (inventoryItem.quantity < quantity) {
    throw new Error(
      `Insufficient stock for ${name}. Available: ${inventoryItem.quantity}`
    );
  }

  inventoryItem.quantity -= quantity;

  await inventoryItem.save();

  return inventoryItem;
};


// ========================================
// CHECK CUSTOM PIZZA INVENTORY
// ========================================

const checkCustomPizzaInventory = async (
  customPizza,
  quantity
) => {
  // Base
  await checkInventory(
    "base",
    customPizza.base.name,
    quantity
  );

  // Sauce
  await checkInventory(
    "sauce",
    customPizza.sauce.name,
    quantity
  );

  // Cheese
  await checkInventory(
    "cheese",
    customPizza.cheese.name,
    quantity
  );

  // Vegetables
  for (const vegetable of customPizza.vegetables) {
    await checkInventory(
      "vegetable",
      vegetable.name,
      quantity
    );
  }

  return true;
};


// ========================================
// DECREASE CUSTOM PIZZA INVENTORY
// ========================================

const decreaseCustomPizzaInventory = async (
  customPizza,
  quantity
) => {
  // Base
  await decreaseInventory(
    "base",
    customPizza.base.name,
    quantity
  );

  // Sauce
  await decreaseInventory(
    "sauce",
    customPizza.sauce.name,
    quantity
  );

  // Cheese
  await decreaseInventory(
    "cheese",
    customPizza.cheese.name,
    quantity
  );

  // Vegetables
  for (const vegetable of customPizza.vegetables) {
    await decreaseInventory(
      "vegetable",
      vegetable.name,
      quantity
    );
  }

  return true;
};


module.exports = {
  checkInventory,
  decreaseInventory,
  checkCustomPizzaInventory,
  decreaseCustomPizzaInventory,
};