const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Inventory = require("./models/Inventory");

dotenv.config();

const inventory = [
  // BASES
  {
    type: "base",
    name: "Classic Hand Tossed",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "base",
    name: "Thin Crust",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "base",
    name: "Cheese Burst",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "base",
    name: "Whole Wheat",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "base",
    name: "Italian Herb",
    quantity: 50,
    lowStockThreshold: 20,
  },

  // SAUCES
  {
    type: "sauce",
    name: "Classic Tomato",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "sauce",
    name: "Spicy Peri Peri",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "sauce",
    name: "BBQ Sauce",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "sauce",
    name: "Pesto Sauce",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "sauce",
    name: "Creamy Garlic",
    quantity: 50,
    lowStockThreshold: 20,
  },

  // CHEESES
  {
    type: "cheese",
    name: "Mozzarella",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "cheese",
    name: "Cheddar",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "cheese",
    name: "Parmesan",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "cheese",
    name: "Cheese Blend",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "cheese",
    name: "Extra Cheese",
    quantity: 50,
    lowStockThreshold: 20,
  },

  // VEGETABLES
  {
    type: "vegetable",
    name: "Onion",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Capsicum",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Tomato",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Sweet Corn",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Jalapeno",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Olives",
    quantity: 50,
    lowStockThreshold: 20,
  },
  {
    type: "vegetable",
    name: "Mushroom",
    quantity: 50,
    lowStockThreshold: 20,
  },
];

const seedInventory = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of inventory) {
      const existingItem = await Inventory.findOne({
        type: item.type,
        name: item.name,
      });

      if (existingItem) {
        console.log(`Skipped: ${item.type} - ${item.name}`);
        skippedCount++;
        continue;
      }

      await Inventory.create(item);

      console.log(`Inserted: ${item.type} - ${item.name}`);
      insertedCount++;
    }

    console.log("\nInventory seeding completed");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped: ${skippedCount}`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Error seeding inventory:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedInventory();