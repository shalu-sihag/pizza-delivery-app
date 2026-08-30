const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Customization = require("./models/Customization");

dotenv.config();

const customizations = [
  // BASES
  {
    type: "base",
    name: "Classic Hand Tossed",
    price: 80,
  },
  {
    type: "base",
    name: "Thin Crust",
    price: 70,
  },
  {
    type: "base",
    name: "Cheese Burst",
    price: 120,
  },
  {
    type: "base",
    name: "Whole Wheat",
    price: 90,
  },
  {
    type: "base",
    name: "Italian Herb",
    price: 100,
  },

  // SAUCES
  {
    type: "sauce",
    name: "Classic Tomato",
    price: 30,
  },
  {
    type: "sauce",
    name: "Spicy Peri Peri",
    price: 40,
  },
  {
    type: "sauce",
    name: "BBQ Sauce",
    price: 45,
  },
  {
    type: "sauce",
    name: "Pesto Sauce",
    price: 50,
  },
  {
    type: "sauce",
    name: "Creamy Garlic",
    price: 50,
  },

  // CHEESES
  {
    type: "cheese",
    name: "Mozzarella",
    price: 60,
  },
  {
    type: "cheese",
    name: "Cheddar",
    price: 70,
  },
  {
    type: "cheese",
    name: "Parmesan",
    price: 80,
  },
  {
    type: "cheese",
    name: "Cheese Blend",
    price: 90,
  },
  {
    type: "cheese",
    name: "Extra Cheese",
    price: 100,
  },

  // VEGETABLES
  {
    type: "vegetable",
    name: "Onion",
    price: 20,
  },
  {
    type: "vegetable",
    name: "Capsicum",
    price: 25,
  },
  {
    type: "vegetable",
    name: "Tomato",
    price: 20,
  },
  {
    type: "vegetable",
    name: "Sweet Corn",
    price: 30,
  },
  {
    type: "vegetable",
    name: "Jalapeno",
    price: 30,
  },
  {
    type: "vegetable",
    name: "Olives",
    price: 35,
  },
  {
    type: "vegetable",
    name: "Mushroom",
    price: 35,
  },
];

const seedCustomizations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of customizations) {
      const existingItem = await Customization.findOne({
        type: item.type,
        name: item.name,
      });

      if (existingItem) {
        console.log(`Skipped: ${item.type} - ${item.name}`);
        skippedCount++;
        continue;
      }

      await Customization.create(item);

      console.log(`Inserted: ${item.type} - ${item.name}`);
      insertedCount++;
    }

    console.log("\nCustomization seeding completed");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped: ${skippedCount}`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Error seeding customizations:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedCustomizations();