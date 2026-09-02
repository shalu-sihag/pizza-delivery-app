const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


// Load environment variables before importing files
// that use process.env
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
require("./jobs/lowStockJob");
const paymentRoutes = require("./routes/paymentRoutes");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/customizations", customizationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/payments", paymentRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pizza Delivery API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});