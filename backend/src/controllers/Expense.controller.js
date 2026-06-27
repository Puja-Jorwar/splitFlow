const Expense = require("../models/Expense");
const Group = require("../models/group");
const mongoose = require("mongoose");

// Helper: compute equal splits for group members
const computeEqualSplits = (members, totalAmount) => {
  const share = parseFloat((totalAmount / members.length).toFixed(2));
  return members.map((memberId) => ({ user: memberId, amount: share }));
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      description,
      amount,
      date,
      category,
      groupId,
      paidById, // optional – defaults to current user
      splitMethod = "equal",
      splits = [], // required for unequal/percentage
      notes,
    } = req.body;

    if (!description || !amount || !groupId) {
      return res
        .status(400)
        .json({ message: "description, amount, and groupId are required" });
    }

    // Verify the current user is a member of the group
    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });
    }

    const paidBy = paidById || userId;

    let computedSplits = [];

    if (splitMethod === "equal") {
      computedSplits = computeEqualSplits(group.members, amount);
    } else if (splitMethod === "unequal" || splitMethod === "percentage") {
      if (!splits.length) {
        return res.status(400).json({
          message: "splits array required for unequal/percentage split",
        });
      }
      computedSplits = splits.map((s) => ({
        user: s.userId,
        amount:
          splitMethod === "percentage"
            ? parseFloat(((s.percentage / 100) * amount).toFixed(2))
            : s.amount,
        percentage: s.percentage,
      }));
    }

    const expense = await Expense.create({
      description,
      amount,
      date: date || new Date(),
      category: category || "Other",
      group: groupId,
      paidBy,
      splitMethod,
      splits: computedSplits,
      notes,
      createdBy: userId,
    });

    await expense.populate([
      { path: "paidBy", select: "name email" },
      { path: "splits.user", select: "name email" },
      { path: "group", select: "name" },
    ]);

    res.status(201).json(expense);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/expenses?groupId=&category=&dateFrom=&dateTo=&page=&limit=
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      groupId,
      category,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = req.query;

    // Only return expenses from groups the user belongs to
    const userGroups = await Group.find({ members: userId }).select("_id");
    const groupIds = userGroups.map((g) => g._id);

    const filter = { group: { $in: groupIds } };
    if (groupId) filter.group = groupId;
    if (category) filter.category = category;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .populate("group", "name");

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/expenses/:expenseId
const getExpenseById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId)
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .populate("group", "name members");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check user is member of the group
    const isMember = expense.group.members
      .map((m) => m.toString())
      .includes(userId);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/expenses/:expenseId
const updateExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId).populate(
      "group",
      "members",
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const isMember = expense.group.members
      .map((m) => m.toString())
      .includes(userId);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowed = [
      "description",
      "amount",
      "date",
      "category",
      "paidBy",
      "splitMethod",
      "splits",
      "notes",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) expense[field] = req.body[field];
    });

    // Recompute splits if amount or splitMethod changed to equal
    if (expense.splitMethod === "equal") {
      expense.splits = computeEqualSplits(
        expense.group.members,
        expense.amount,
      );
    }

    await expense.save();
    await expense.populate([
      { path: "paidBy", select: "name email" },
      { path: "splits.user", select: "name email" },
    ]);

    res.status(200).json(expense);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/expenses/:expenseId
const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId).populate(
      "group",
      "members createdBy",
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const isCreator = expense.createdBy.toString() === userId;
    const isGroupCreator = expense.group.createdBy?.toString() === userId;
    if (!isCreator && !isGroupCreator) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this expense" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/expenses/analytics/summary?groupId=&dateFrom=&dateTo=
const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, dateFrom, dateTo } = req.query;

    const userGroups = await Group.find({ members: userId }).select("_id");
    const groupIds = userGroups.map((g) => g._id);

    const matchStage = { group: { $in: groupIds } };
    if (groupId) matchStage.group = new mongoose.Types.ObjectId(groupId);
    if (dateFrom || dateTo) {
      matchStage.date = {};
      if (dateFrom) matchStage.date.$gte = new Date(dateFrom);
      if (dateTo) matchStage.date.$lte = new Date(dateTo);
    }

    // Total spent + by category
    const [categorySummary, monthlyTrend, groupSummary] = await Promise.all([
      Expense.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Expense.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$group",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "groups",
            localField: "_id",
            foreignField: "_id",
            as: "groupInfo",
          },
        },
        { $unwind: "$groupInfo" },
        {
          $project: {
            groupName: "$groupInfo.name",
            total: 1,
            count: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const totalSpent = categorySummary.reduce((sum, c) => sum + c.total, 0);

    res.status(200).json({
      totalSpent,
      categorySummary,
      monthlyTrend,
      groupSummary,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/expenses/balances — per-user net balances across all groups
const getMyBalances = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userGroups = await Group.find({ members: userId }).select("_id");
    const groupIds = userGroups.map((g) => g._id);

    // Amounts user is owed (user paid)
    const paid = await Expense.aggregate([
      { $match: { group: { $in: groupIds }, paidBy: userObjectId } },
      { $unwind: "$splits" },
      {
        $match: {
          "splits.user": { $ne: userObjectId },
          "splits.settled": false,
        },
      },
      {
        $group: {
          _id: "$splits.user",
          totalOwed: { $sum: "$splits.amount" },
        },
      },
    ]);

    // Amounts user owes (user is in splits but did not pay)
    const owes = await Expense.aggregate([
      {
        $match: {
          group: { $in: groupIds },
          paidBy: { $ne: userObjectId },
          "splits.user": userObjectId,
          "splits.settled": false,
        },
      },
      { $unwind: "$splits" },
      { $match: { "splits.user": userObjectId, "splits.settled": false } },
      {
        $group: {
          _id: "$paidBy",
          totalOwes: { $sum: "$splits.amount" },
        },
      },
    ]);

    res.status(200).json({
      youAreOwed: paid,
      youOwe: owes,
    });
  } catch (error) {
    console.error("Balance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getAnalyticsSummary,
  getMyBalances,
};
