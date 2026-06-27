const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    method: {
      type: String,
      enum: ["upi", "paypal", "bank", "cash", "other"],
      default: "cash",
    },
    notes: { type: String, trim: true },
    relatedExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
