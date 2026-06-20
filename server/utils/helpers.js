const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'f83bf876adbc9d4949a2e6cf46a9482d92120e36ec2614b7e80be951a8d052a2',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Estimate Read Time for blogs (based on average speed of 200 words per minute)
const estimateReadTime = (content) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200);
  return time < 1 ? 1 : time;
};

module.exports = {
  generateToken,
  estimateReadTime,
};
