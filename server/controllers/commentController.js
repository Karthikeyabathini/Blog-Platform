const Comment = require('../models/Comment');

// @desc    Get comments for a blog post
// @route   GET /api/comments/:blogId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate('userId', 'name avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment (or reply) to a blog
// @route   POST /api/comments/:blogId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { comment, parentComment } = req.body;
    const blogId = req.params.blogId;

    const newComment = await Comment.create({
      blogId,
      userId: req.user.id,
      comment,
      parentComment: parentComment || null,
    });

    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name avatar role');

    res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit own comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this comment' });
    }

    comment.comment = req.body.comment;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatar role');

    res.status(200).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment (or reply)
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership or admin
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Also delete any replies to this comment (cascading delete for replies)
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment and its replies removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
