const Group = require("../models/group");
const User = require("../models/User");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// POST /api/groups
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Group name is required" });

    const group = await Group.create({
      name,
      description: description || "",
      members: [req.user.userId],
      createdBy: req.user.userId,
    });

    await group.populate("members", "name email");
    res.status(201).json(group);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/groups
const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.find({ members: userId })
      .populate("members", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const groupsWithStats = await Promise.all(
      groups.map(async (group) => {
        const [expenseCount, expenseTotal] = await Promise.all([
          Expense.countDocuments({ group: group._id }),
          Expense.aggregate([
            { $match: { group: group._id } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
        ]);
        return {
          ...group.toObject(),
          expenseCount,
          totalAmount: expenseTotal[0]?.total || 0,
        };
      }),
    );

    res
      .status(200)
      .json({
        success: true,
        count: groupsWithStats.length,
        groups: groupsWithStats,
      });
  } catch (error) {
    console.error("Get groups error:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

// GET /api/groups/:groupId
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findOne({ _id: groupId, members: userId })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });

    const [expenseCount, expenseTotal] = await Promise.all([
      Expense.countDocuments({ group: groupId }),
      Expense.aggregate([
        { $match: { group: new mongoose.Types.ObjectId(groupId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res
      .status(200)
      .json({
        ...group.toObject(),
        expenseCount,
        totalAmount: expenseTotal[0]?.total || 0,
      });
  } catch (error) {
    console.error("Get group by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/groups/:groupId
const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    const { name, description } = req.body;

    const group = await Group.findOne({ _id: groupId, createdBy: userId });
    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or you're not the owner" });

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    await group.save();
    await group.populate("members", "name email");
    res.status(200).json(group);
  } catch (error) {
    console.error("Update group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/groups/:groupId
const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findOne({ _id: groupId, createdBy: userId });
    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or you're not the owner" });

    await Expense.deleteMany({ group: groupId });
    await group.deleteOne();
    res
      .status(200)
      .json({ message: "Group and its expenses deleted successfully" });
  } catch (error) {
    console.error("Delete group error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/groups/:groupId/members
const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });

    const newMember = await User.findOne({ email: email.toLowerCase() });
    if (!newMember)
      return res
        .status(404)
        .json({ message: "User with that email not found" });

    const alreadyMember = group.members
      .map((m) => m.toString())
      .includes(newMember._id.toString());
    if (alreadyMember)
      return res.status(400).json({ message: "User is already a member" });

    group.members.push(newMember._id);
    await group.save();
    await group.populate("members", "name email");
    res.status(200).json(group);
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/groups/:groupId/members/:memberId
const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findOne({ _id: groupId, createdBy: userId });
    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or you're not the owner" });

    if (memberId === group.createdBy.toString())
      return res
        .status(400)
        .json({ message: "Cannot remove the group creator" });

    group.members = group.members.filter((m) => m.toString() !== memberId);
    await group.save();
    await group.populate("members", "name email");
    res.status(200).json(group);
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/groups/:groupId/balances
const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    }).populate("members", "name email");
    if (!group)
      return res
        .status(404)
        .json({ message: "Group not found or access denied" });

    const expenses = await Expense.find({ group: groupId }).populate(
      "paidBy",
      "name email",
    );

    const balanceMap = {};
    for (const expense of expenses) {
      for (const split of expense.splits) {
        if (split.settled) continue;
        const ower = split.user.toString();
        const creditor = expense.paidBy._id.toString();
        if (ower === creditor) continue;
        if (!balanceMap[ower]) balanceMap[ower] = {};
        balanceMap[ower][creditor] =
          (balanceMap[ower][creditor] || 0) + split.amount;
      }
    }

    const simplified = [];
    const seen = new Set();
    for (const ower of Object.keys(balanceMap)) {
      for (const creditor of Object.keys(balanceMap[ower])) {
        const key = [ower, creditor].sort().join("-");
        if (seen.has(key)) continue;
        seen.add(key);
        const owes = balanceMap[ower]?.[creditor] || 0;
        const reverse = balanceMap[creditor]?.[ower] || 0;
        const net = owes - reverse;
        if (net > 0.01)
          simplified.push({
            from: ower,
            to: creditor,
            amount: parseFloat(net.toFixed(2)),
          });
        else if (net < -0.01)
          simplified.push({
            from: creditor,
            to: ower,
            amount: parseFloat((-net).toFixed(2)),
          });
      }
    }

    const memberMap = {};
    group.members.forEach((m) => (memberMap[m._id.toString()] = m));

    const result = simplified.map((b) => ({
      from: memberMap[b.from],
      to: memberMap[b.to],
      amount: b.amount,
    }));

    res.status(200).json({ balances: result });
  } catch (error) {
    console.error("Group balances error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  getGroupBalances,
};
