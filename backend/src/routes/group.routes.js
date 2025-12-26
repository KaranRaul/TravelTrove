const express = require('express');
const groupController = require('../controllers/group.controller');
const protect = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', protect, groupController.createGroup);
router.get('/my', protect, groupController.getMyGroups);
router.get('/public', protect, groupController.getPublicGroups);
router.get('/:id', protect, groupController.getGroupById);
router.delete('/:id', protect, groupController.deleteGroup);
router.post('/:id/join', protect, groupController.joinGroup);
router.post('/:id/invite', protect, groupController.inviteUser);
router.get('/:id/members', protect, groupController.getGroupMembers);
router.post('/:id/leave', protect, groupController.leaveGroup);
router.get('/:id/conversation', protect, groupController.getGroupConversationId);

module.exports = router;
