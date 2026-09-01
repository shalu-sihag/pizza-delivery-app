const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const FROM_EMAIL = process.env.EMAIL_USER;
const FROM_NAME = "Pizza Delivery App";

// ========================================
// SEND VERIFICATION EMAIL
// ========================================

const sendVerificationEmail = async (email, otp) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: FROM_EMAIL,
    name: FROM_NAME,
  };

  sendSmtpEmail.to = [
    {
      email,
    },
  ];

  sendSmtpEmail.subject = "Pizza Delivery - Email Verification";

  sendSmtpEmail.htmlContent = `
    <h2>Verify your email</h2>

    <p>Your email verification OTP is:</p>

    <h1>${otp}</h1>

    <p>This OTP will expire in 10 minutes.</p>

    <p>
      If you did not create an account, please ignore this email.
    </p>
  `;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Verification email sent successfully:", result);

    return result;
  } catch (error) {
    console.error(
      "Brevo verification email error:",
      error.response?.body || error.message || error
    );

    throw new Error("Failed to send verification email");
  }
};

// ========================================
// SEND PASSWORD RESET EMAIL
// ========================================

const sendPasswordResetEmail = async (email, otp) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: FROM_EMAIL,
    name: FROM_NAME,
  };

  sendSmtpEmail.to = [
    {
      email,
    },
  ];

  sendSmtpEmail.subject = "Pizza Delivery - Password Reset";

  sendSmtpEmail.htmlContent = `
    <h2>Password Reset</h2>

    <p>Your password reset OTP is:</p>

    <h1>${otp}</h1>

    <p>This OTP will expire in 10 minutes.</p>

    <p>
      If you did not request a password reset, please ignore this email.
    </p>
  `;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Password reset email sent successfully:", result);

    return result;
  } catch (error) {
    console.error(
      "Brevo password reset email error:",
      error.response?.body || error.message || error
    );

    throw new Error("Failed to send password reset email");
  }
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

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    email: FROM_EMAIL,
    name: FROM_NAME,
  };

  sendSmtpEmail.to = [
    {
      email: FROM_EMAIL,
    },
  ];

  sendSmtpEmail.subject = "Pizza Delivery - Low Stock Alert";

  sendSmtpEmail.htmlContent = `
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
  `;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Low stock email sent successfully:", result);

    return result;
  } catch (error) {
    console.error(
      "Brevo low stock email error:",
      error.response?.body || error.message || error
    );

    throw new Error("Failed to send low stock email");
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockEmail,
};