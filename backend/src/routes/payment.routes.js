const express = require("express");
const {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentSummary,
  deletePayment,
} = require("../controllers/Payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/summary", getPaymentSummary);
router.get("/:paymentId", getPaymentById);
router.delete("/:paymentId", deletePayment);

module.exports = router;
