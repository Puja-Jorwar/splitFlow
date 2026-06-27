const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number },
  settled: { type: Boolean, default: false },
});

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: [
        "Groceries",
        "Dining",
        "Utilities",
        "Rent",
        "Transportation",
        "Entertainment",
        "Travel",
        "Shopping",
        "Healthcare",
        "Education",
        "Other",
      ],
      default: "Other",
    },
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
    splitMethod: {
      type: String,
      enum: ["equal", "unequal", "percentage"],
      default: "equal",
    },
    splits: [splitSchema],
    notes: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
