const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  bookmarkBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { validateBlog } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.route('/')
  .get(getBlogs)
  .post(protect, upload.single('featuredImage'), validateBlog, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, upload.single('featuredImage'), updateBlog)
  .delete(protect, deleteBlog);

router.put('/:id/like', protect, likeBlog);
router.put('/:id/bookmark', protect, bookmarkBlog);

module.exports = router;
