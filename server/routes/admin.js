const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  deleteUser,
  deleteBlog,
  deleteComment,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Apply protect and authorize('admin') to all routes in this router
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.delete('/blogs/:id', deleteBlog);
router.delete('/comments/:id', deleteComment);

module.exports = router;
