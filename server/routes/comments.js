const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

router.route('/:blogId')
  .get(getComments)
  .post(protect, validateComment, addComment);

router.route('/:id')
  .put(protect, validateComment, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
