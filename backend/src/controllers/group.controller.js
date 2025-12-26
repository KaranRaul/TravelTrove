const Group = require('../models/Group');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const createGroup = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const owner = req.user._id;

    const group = new Group({
      name,
      description,
      owner,
      members: [owner],
      isPublic,
    });

    await group.save();

    const conversation = new Conversation({
      type: 'group',
      group: group._id,
      participants: [owner],
    });

    await conversation.save();

    res.status(201).json({ group, conversationId: conversation._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate('owner', 'name email')
            .populate('members', 'name email');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicGroups = async (req, res) => {
    try {
        const groups = await Group.find({ isPublic: true })
            .populate('owner', 'name email')
            .populate('members', 'name email');
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!group.isPublic) {
            return res.status(400).json({ message: 'This is a private group' });
        }
        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this group' });
        }
        group.members.push(req.user._id);
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const inviteUser = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (group.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not the owner of this group' });
        }
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (group.members.includes(user._id)) {
            return res.status(400).json({ message: 'This user is already a member of this group' });
        }
        group.members.push(user._id);
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupMembers = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('members', 'name email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group.members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (group.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'You are not the owner of this group' });
        }
        await Conversation.deleteOne({ group: group._id });
        await group.remove();
        res.json({ message: 'Group removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const leaveGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (group.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot leave a group you own' });
        }
        group.members = group.members.filter(member => member.toString() !== req.user._id.toString());
        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupConversationId = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ group: req.params.id });
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json({ conversationId: conversation._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createGroup,
  getMyGroups,
  getPublicGroups,
  getGroupById,
  joinGroup,
  inviteUser,
  getGroupMembers,
  deleteGroup,
  leaveGroup,
  getGroupConversationId,
};
