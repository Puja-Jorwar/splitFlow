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
    const userId = req.user.userId;

    const groups = await Group.find({
      members: userId,
    })
      .select("name members createdBy createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("Get groups error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};

// GET GROUP DETAILS BY ID
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    }).select("name members createdBy createdAt");

    if (!group) {
      return res.status(404).json({
        message: "Group not found or access denied",
      });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroupById,
};
