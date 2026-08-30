const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// ========================================
// SEND VERIFICATION EMAIL
// ========================================

const sendVerificationEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Pizza Delivery - Email Verification",
    html: `
      <h2>Verify your email</h2>
      <p>Your email verification OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
};


// ========================================
// SEND PASSWORD RESET EMAIL
// ========================================

const sendPasswordResetEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Pizza Delivery - Password Reset",
    html: `
      <h2>Password Reset</h2>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `,
  });
};


// ========================================
// SEND LOW STOCK EMAIL
// ========================================

const sendLowStockEmail = async (inventoryItems) => {
  if (!inventoryItems || inventoryItems.length === 0) {
    return;
  }

  const inventoryRows = inventoryItems
    .map(
      (item) => `
        <tr>
          <td>${item.type}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.lowStockThreshold}</td>
        </tr>
      `
    )
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Pizza Delivery - Low Stock Alert",
    html: `
      <h2>Low Stock Alert</h2>

      <p>
        The following inventory items are at or below
        their configured low-stock threshold:
      </p>

      <table
        border="1"
        cellpadding="8"
        cellspacing="0"
        style="border-collapse: collapse;"
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>Item</th>
            <th>Current Stock</th>
            <th>Threshold</th>
          </tr>
        </thead>

        <tbody>
          ${inventoryRows}
        </tbody>
      </table>

      <p>
        Please update the inventory if necessary.
      </p>
    `,
  });
};


module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockEmail,
};