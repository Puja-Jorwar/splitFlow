const Group = require("../models/group");

// CREATE GROUP
const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name,
      members: [req.user.userId],
      createdBy: req.user.userId,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY GROUPS
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.userId,
    });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createGroup, getMyGroups };
