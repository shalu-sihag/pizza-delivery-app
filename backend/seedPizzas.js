const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Pizza = require("./models/Pizza");

dotenv.config();

const pizzas = [
  {
    name: "Margherita Pizza",
    price: 199,
    image:
      "https://foodbyjonister.com/wp-content/uploads/2020/01/MargheritaPizza.jpg",
    description:
      "Classic pizza topped with fresh tomatoes, mozzarella cheese, and basil.",
    category: "veg",
  },
  {
    name: "Farmhouse Pizza",
    price: 299,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8aptf1MBLa_kBg4o3j9t0Y14C5_rM1MzIKmGcXWnATEleyDI6zHubbjfP&s=10",
    description:
      "Loaded with onion, capsicum, tomato, and delicious mozzarella cheese.",
    category: "veg",
  },
  {
    name: "Peppy Paneer Pizza",
    price: 329,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd8iMXCR7txEdoHVXIDu-uNtl9E2MR98syFHqK2xrDt3T9V_-dmPZtLYuo&s=10",
    description:
      "Spicy and flavorful pizza topped with paneer, capsicum, onion, and cheese.",
    category: "veg",
  },
  {
    name: "Veggie Paradise Pizza",
    price: 279,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8fKP5y-1RjW270OfmsYbkDbcEw_3Q4a08i_o8FYwwJWWRGIzMuK410VU&s=10",
    description:
      "A delicious combination of fresh vegetables, herbs, and melted mozzarella cheese.",
    category: "veg",
  },
  {
    name: "Cheese Burst Pizza",
    price: 349,
    image:
      "https://cdn.uengage.io/uploads/66344/image-QH55DD-1773319239.png",
    description:
      "Extra cheesy pizza with a rich and creamy cheese-filled crust.",
    category: "veg",
  },
  {
    name: "Paneer Tikka Pizza",
    price: 359,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT22n3SH5xv3xQCC4dhZWXqZP4K4F6NVonTBfVxXrwDP6t1jXWhU8xsweM&s=10",
    description:
      "Tandoori-style paneer, onion, capsicum, and spicy tikka sauce on a cheesy base.",
    category: "veg",
  },
  {
    name: "Corn & Cheese Pizza",
    price: 249,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHACXvDm6jnJGAWvu2N_8HYzPHOnbJr5_tx_QJfqFDExfU155FRqwgMJRc&s=10",
    description:
      "Sweet corn combined with mozzarella cheese and a creamy pizza sauce.",
    category: "veg",
  },
  {
    name: "Mexican Green Wave Pizza",
    price: 319,
    image:
      "https://vegplatter.in/files/public/images/partner/menu/4/MEXICAN-GREEN-WAVE_0.jpg",
    description:
      "A spicy Mexican-inspired pizza with capsicum, onion, jalapenos, and cheese.",
    category: "veg",
  },
  {
    name: "Chicken Tikka Pizza",
    price: 399,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJYJmlIA7T2-BBOHc05b-K243RewpzQDuhlGLH7uNn6Q&s=10",
    description:
      "Juicy chicken tikka pieces with onion, capsicum, herbs, and mozzarella cheese.",
    category: "non-veg",
  },
  {
    name: "BBQ Chicken Pizza",
    price: 429,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzESR9BYQ6NNHV9XiYdZMKpOfNwInePlZbaj2XYaPKUhfXMJATN972F1fR&s=10",
    description:
      "Smoky BBQ chicken topped with onion, cheese, and flavorful BBQ sauce.",
    category: "non-veg",
  },
  {
    name: "Chicken Pepperoni Pizza",
    price: 449,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGgay-CLjgukYBnOvxhFaO3vI0Q84ggwuGaiQ62r4Sn4w5ABLl20KOJ6mh&s=10",
    description:
      "Loaded with chicken pepperoni, mozzarella cheese, and rich tomato sauce.",
    category: "non-veg",
  },
  {
    name: "Spicy Chicken Pizza",
    price: 399,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdZsoewA4nbCzeCxo7sIIqX91pPnPaqelxCvr7fgeGNpORzd-eGyuD3ui1&s=10",
    description:
      "Spicy chicken pieces, jalapenos, onion, and cheese for a fiery pizza experience.",
    category: "non-veg",
  },
];

const seedPizzas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const pizzaData of pizzas) {
      const existingPizza = await Pizza.findOne({
        name: pizzaData.name,
      });

      if (existingPizza) {
        console.log(`Skipped: ${pizzaData.name}`);
        skippedCount++;
        continue;
      }

      await Pizza.create(pizzaData);

      console.log(`Inserted: ${pizzaData.name}`);
      insertedCount++;
    }

    console.log("\nPizza seeding completed");
    console.log(`Inserted: ${insertedCount}`);
    console.log(`Skipped: ${skippedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding pizzas:", error);
    process.exit(1);
  }
};

seedPizzas();