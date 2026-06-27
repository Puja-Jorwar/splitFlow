const Payment = require("../models/Payment");
const Expense = require("../models/Expense");
const Group = require("../models/group");
const mongoose = require("mongoose");

// POST /api/payments
const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      groupId,
      paidToId,
      amount,
      method = "cash",
      notes,
      relatedExpenseId,
    } = req.body;

    if (!groupId || !paidToId || !amount) {
      return res
        .status(400)
        .json({ message: "groupId, paidToId, and amount are required" });
    }

    if (paidToId === userId) {
      return res.status(400).json({ message: "Cannot pay yourself" });
    }

    // Verify user is in the group
    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });
    }

    // If there's a related expense, mark that split as settled
    if (relatedExpenseId) {
      await Expense.updateOne(
        {
          _id: relatedExpenseId,
          "splits.user": new mongoose.Types.ObjectId(userId),
        },
        { $set: { "splits.$.settled": true } },
      );
    }

    const payment = await Payment.create({
      group: groupId,
      paidBy: userId,
      paidTo: paidToId,
      amount,
      method,
      notes,
      relatedExpense: relatedExpenseId || undefined,
      recordedBy: userId,
    });

    await payment.populate([
      { path: "paidBy", select: "name email" },
      { path: "paidTo", select: "name email" },
      { path: "group", select: "name" },
    ]);

    res.status(201).json(payment);
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments?groupId=&page=&limit=
const getPayments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, page = 1, limit = 20 } = req.query;

    // Only show payments from groups the user is in
    const userGroups = await Group.find({ members: userId }).select("_id");
    const groupIds = userGroups.map((g) => g._id);

    const filter = { group: { $in: groupIds } };
    if (groupId) filter.group = groupId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(filter);

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("paidBy", "name email")
      .populate("paidTo", "name email")
      .populate("group", "name");

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments/summary — totals paid out vs received
const getPaymentSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userGroups = await Group.find({ members: userId }).select("_id");
    const groupIds = userGroups.map((g) => g._id);

    const [paid, received] = await Promise.all([
      Payment.aggregate([
        { $match: { group: { $in: groupIds }, paidBy: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { group: { $in: groupIds }, paidTo: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.status(200).json({
      totalPaid: paid[0]?.total || 0,
      totalReceived: received[0]?.total || 0,
    });
  } catch (error) {
    console.error("Payment summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/payments/:paymentId
const getPaymentById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate("paidBy", "name email")
      .populate("paidTo", "name email")
      .populate("group", "name members");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const isMember = payment.group.members
      .map((m) => m.toString())
      .includes(userId);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/payments/:paymentId
const deletePayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.recordedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the recorder can delete this payment" });
    }

    // If there was a linked expense split, un-settle it
    if (payment.relatedExpense) {
      await Expense.updateOne(
        {
          _id: payment.relatedExpense,
          "splits.user": new mongoose.Types.ObjectId(userId),
        },
        { $set: { "splits.$.settled": false } },
      );
    }

    await payment.deleteOne();
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentSummary,
  deletePayment,
};
