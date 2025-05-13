const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkAdmin = require('../middleware/checkAdmin');

const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag
} = require('../controllers/TagController');

// ✅ Quản trị tag (admin-only)
router.get('/', authenticateToken, checkAdmin, getAllTags);
router.post('/', authenticateToken, checkAdmin, createTag);
router.put('/:id', authenticateToken, checkAdmin, updateTag);
router.delete('/:id', authenticateToken, checkAdmin, deleteTag);

module.exports = router;
