const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get dashboard metrics & trends
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Extra details
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });

    // Recent signups
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    // Recent blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBlogs,
        totalComments,
        publishedBlogs,
        draftBlogs,
      },
      recentUsers,
      recentBlogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow deleting current logged-in admin
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    // Delete user's comments and blogs (cascade delete)
    await Comment.deleteMany({ userId: user._id });
    await Blog.deleteMany({ author: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated blogs/comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete any blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Delete associated comments
    await Comment.deleteMany({ blogId: blog._id });

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog and associated comments deleted successfully by admin',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete any comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Delete nested replies
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully by admin',
    });
  } catch (error) {
    next(error);
  }
};
