const { body, validationResult } = require('express-validator');

// Error checker helper middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

const validateLogin = [
  body('email').isEmail().withMessage('Please include a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const validateBlog = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  validate,
];

const validateComment = [
  body('comment').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateBlog,
  validateComment,
};
