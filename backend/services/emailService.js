const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "onboarding@resend.dev";

// ========================================
// SEND VERIFICATION EMAIL
// ========================================

const sendVerificationEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Pizza Delivery - Email Verification",
    html: `
      <h2>Verify your email</h2>

      <p>Your email verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>
        If you did not create an account, please ignore this email.
      </p>
    `,
  });

  if (error) {
    console.error("Resend verification email error:", error);
    throw new Error(error.message || "Failed to send verification email");
  }

  return data;
};

// ========================================
// SEND PASSWORD RESET EMAIL
// ========================================

const sendPasswordResetEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Pizza Delivery - Password Reset",
    html: `
      <h2>Password Reset</h2>

      <p>Your password reset OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>

      <p>
        If you did not request a password reset, please ignore this email.
      </p>
    `,
  });

  if (error) {
    console.error("Resend password reset email error:", error);
    throw new Error(error.message || "Failed to send password reset email");
  }

  return data;
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

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [process.env.EMAIL_USER],
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

  if (error) {
    console.error("Resend low stock email error:", error);
    throw new Error(error.message || "Failed to send low stock email");
  }

  return data;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockEmail,
};