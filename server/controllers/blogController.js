const Blog = require('../models/Blog');
const { estimateReadTime } = require('../utils/helpers');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const query = {};

    // Filters
    // 1. Status: Default to published unless checking author dashboard/admin
    if (req.query.status) {
      query.status = req.query.status;
    } else {
      query.status = 'published';
    }

    // 2. Search by title, content, or tags
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // 3. Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 4. Tag filter
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // 5. Author filter
    if (req.query.author) {
      query.author = req.query.author;
    }

    // 6. Bookmarks filter
    if (req.query.bookmarkedBy) {
      query.bookmarks = req.query.bookmarkedBy;
    }

    // Execution
    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        total: totalBlogs,
        page,
        pages: Math.ceil(totalBlogs / limit),
      },
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID or slug
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find by either slug or Mongo ObjectId
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    let blog = await Blog.findOne(query).populate('author', 'name avatar role');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    // Format estimate read time
    const readTime = estimateReadTime(blog.content);

    res.status(200).json({
      success: true,
      blog: {
        ...blog.toObject(),
        readTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags, status } = req.body;
    let featuredImage = '';

    // Handle image upload from multer
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    } else if (req.body.featuredImage) {
      featuredImage = req.body.featuredImage;
    }

    // Parse tags if sent as string (e.g. from FormData)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      tags: parsedTags || [],
      featuredImage,
      status: status || 'draft',
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Check ownership or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this blog' });
    }

    const { title, content, category, tags, status } = req.body;

    if (title) {
      blog.title = title;
      // Slug updates automatically via pre-save hook when title is modified
    }
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (status) blog.status = status;

    if (tags) {
      let parsedTags = tags;
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
      blog.tags = parsedTags;
    }

    // Handle image upload from multer
    if (req.file) {
      blog.featuredImage = `/uploads/${req.file.filename}`;
    } else if (req.body.featuredImage !== undefined) {
      blog.featuredImage = req.body.featuredImage;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Check ownership or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const index = blog.likes.indexOf(req.user.id);

    if (index === -1) {
      // Like
      blog.likes.push(req.user.id);
    } else {
      // Unlike
      blog.likes.splice(index, 1);
    }

    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark / Unbookmark blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
exports.bookmarkBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const index = blog.bookmarks.indexOf(req.user.id);

    if (index === -1) {
      // Bookmark
      blog.bookmarks.push(req.user.id);
    } else {
      // Unbookmark
      blog.bookmarks.splice(index, 1);
    }

    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      bookmarksCount: blog.bookmarks.length,
      bookmarks: blog.bookmarks,
    });
  } catch (error) {
    next(error);
  }
};
