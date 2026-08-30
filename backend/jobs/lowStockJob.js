const cron = require("node-cron");

const Inventory = require("../models/Inventory");

const {
  sendLowStockEmail,
} = require("../services/emailService");


// ========================================
// LOW STOCK CHECK
// ========================================

const checkLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: {
        $lte: ["$quantity", "$lowStockThreshold"],
      },
    }).sort({
      type: 1,
      name: 1,
    });

    if (lowStockItems.length === 0) {
      console.log("Low stock check: No low-stock items.");
      return;
    }

    console.log(
      `Low stock check: ${lowStockItems.length} item(s) below threshold.`
    );

    await sendLowStockEmail(lowStockItems);

    console.log("Low stock alert email sent successfully.");
  } catch (error) {
    console.error(
      "Low stock job error:",
      error.message
    );
  }
};


// ========================================
// SCHEDULE JOB
// ========================================

// Runs every hour
cron.schedule("0 * * * *", () => {
  console.log("Running scheduled low stock check...");

  checkLowStock();
});


module.exports = {
  checkLowStock,
};