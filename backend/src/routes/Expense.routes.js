const express = require("express");
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getAnalyticsSummary,
  getMyBalances,
} = require("../controllers/Expense.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/analytics/summary", getAnalyticsSummary);
router.get("/balances/me", getMyBalances);
router.get("/:expenseId", getExpenseById);
router.put("/:expenseId", updateExpense);
router.delete("/:expenseId", deleteExpense);

module.exports = router;
