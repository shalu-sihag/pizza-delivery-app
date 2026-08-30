const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PasswordReset = mongoose.model(
  "PasswordReset",
  passwordResetSchema
);

module.exports = PasswordReset;