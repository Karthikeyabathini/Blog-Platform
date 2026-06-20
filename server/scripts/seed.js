const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog-platform');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    console.log('Existing DB collections wiped clean.');

    // 1. Create Users
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@blog.com',
      password: 'adminpassword',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=System%20Admin&backgroundColor=f43f5e',
    });

    const writerJohn = new User({
      name: 'John Doe',
      email: 'john@blog.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John%20Doe&backgroundColor=0ea5e9',
    });

    const writerJane = new User({
      name: 'Jane Smith',
      email: 'jane@blog.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Smith&backgroundColor=10b981',
    });

    await adminUser.save();
    await writerJohn.save();
    await writerJane.save();
    console.log('Seed users created successfully!');

    // 2. Create Blogs
    const blogs = [
      {
        title: 'Getting Started with React 19 and Vite',
        content: `<h2>Introduction to the Next Era of React</h2><p>React 19 brings exciting new features like compiler improvements, server actions, and smoother state transitions. Coupled with Vite, you get an ultra-fast developer feedback loop and an optimized bundle size that guarantees exceptional page loads.</p><h3>Why Vite?</h3><p>Vite has quickly become the industry standard replacing Create React App (CRA). It offers instantaneous hot module replacement (HMR) and uses native ES modules to compile code on the fly during development.</p><h3>Key Features of React 19:</h3><ul><li><strong>React Compiler:</strong> No more manually writing useMemo and useCallback hooks. The compiler optimizes re-renders automatically.</li><li><strong>Actions:</strong> Simple syntax to submit forms and handle load states without manual async trackers.</li><li><strong>New Hooks:</strong> usetransition and useActionState simplify asynchronous UI states.</li></ul><p>Start building today to stay ahead of modern web design standards!</p>`,
        category: 'Technology',
        tags: ['React', 'Vite', 'Frontend', 'Web Development'],
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        author: writerJohn._id,
        status: 'published',
        views: 245,
        likes: [writerJane._id],
        bookmarks: [writerJane._id, adminUser._id],
      },
      {
        title: 'Mastering Tailwind CSS: Design Systems from Scratch',
        content: `<h2>Build Premium Layouts Easily</h2><p>Tailwind CSS changed how web developers look at custom styling. Instead of writing heavy stylesheet components or dealing with global cascading issues, Tailwind uses utility classes directly in HTML to build beautiful, responsive layouts rapidly.</p><h3>Creating Harmonious Color Palettes</h3><p>Use HSL values or specific neutral hues rather than default stark colors. A slate gray mixed with deep cobalt accents provides an incredibly professional, modern vibe. Use transitions (\`transition-all duration-300\`) to make hover states feel alive and premium.</p><blockquote>"Great design is not just what it looks like and feels like. Design is how it works." - Steve Jobs</blockquote><p>Combine gradients, glassmorphism shadows, and smooth micro-animations to create clean, responsive components that wow your clients from first look.</p>`,
        category: 'Design',
        tags: ['CSS', 'Tailwind', 'UI/UX', 'Web Design'],
        featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        author: writerJane._id,
        status: 'published',
        views: 312,
        likes: [writerJohn._id, adminUser._id],
        bookmarks: [writerJohn._id],
      },
      {
        title: 'The Ultimate Guide to REST API Design with Express',
        content: `<h2>Designing Clean MVC Backends</h2><p>Express.js is light, robust, and highly extensible. But without strict structure, codebases quickly grow into unmanageable spaghetti code. Adhering to the MVC (Model-View-Controller) architecture keeps code compartmentalized, readable, and ready for production expansion.</p><h3>Core Security Pillars</h3><p>When deploying production apps, security cannot be an afterthought:</p><ol><li><strong>Helmet:</strong> Protects HTTP headers from common vulnerabilities.</li><li><strong>CORS:</strong> Directs which frontend domains can query your backend.</li><li><strong>Rate Limiting:</strong> Halts brute force attacks on auth routes.</li><li><strong>Mongo Sanitize:</strong> Prevents MongoDB injection hacks.</li></ol><p>Implement validation with express-validator to make sure user input matches expected schemas before querying databases!</p>`,
        category: 'Backend',
        tags: ['Node', 'Express', 'API', 'Security'],
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        author: adminUser._id,
        status: 'published',
        views: 189,
        likes: [writerJohn._id],
        bookmarks: [],
      },
      {
        title: 'A Beginner Guide to Database Operations with Mongoose',
        content: `<h2>Understanding ORMs for MongoDB</h2><p>MongoDB provides immense flexibility, but application-level validations are essential. That's where Mongoose comes in. It acts as an Object Data Modeling (ODM) framework, allowing us to declare schemas, setup pre-save hooks (like hashing passwords or slugifying titles), and perform populates easily.</p><h3>Populations and Aggregates</h3><p>Populating references (\`populate('author')\`) allows us to fetch related documents in other collections in a single query logic, simulating joins in relational databases. Learn validation rules to ensure data consistency across your platforms.</p>`,
        category: 'Database',
        tags: ['Mongoose', 'MongoDB', 'Database', 'NoSQL'],
        featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        author: writerJohn._id,
        status: 'published',
        views: 95,
        likes: [],
        bookmarks: [writerJane._id],
      },
      {
        title: '10 Web Development Tips to Boost Project Performance',
        content: `<h2>Optimize Speed and Conversions</h2><p>Slow page loads are the number one reason users leave blogs. By optimizing image assets, minifying styles, implementing lazy loading, and caching heavy queries, you can bring page loads down to under a second.</p><h3>Client-Side Performance</h3><p>Use modern React features and avoid nested API rendering issues. Leverage Vite's code splitting and route-based code-splitting to keep asset size minimal.</p>`,
        category: 'Technology',
        tags: ['Performance', 'Optimization', 'Vite', 'React'],
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        author: writerJane._id,
        status: 'draft', // Saved as draft
        views: 0,
        likes: [],
        bookmarks: [],
      },
    ];

    const seededBlogs = await Blog.insertMany(blogs);
    console.log('Seed blogs inserted!');

    // 3. Create Comments
    const comment1 = await Comment.create({
      blogId: seededBlogs[0]._id, // React 19 post
      userId: writerJane._id,
      comment: 'Excellent article! I am super excited about the new React Compiler removing useMemo boilerplate.',
    });

    const comment2 = await Comment.create({
      blogId: seededBlogs[0]._id, // React 19 post
      userId: adminUser._id,
      comment: 'This is a fantastic guide. Vite makes React development exceptionally smooth.',
    });

    // Nested reply to comment1
    await Comment.create({
      blogId: seededBlogs[0]._id,
      userId: writerJohn._id,
      comment: 'Me too, Jane! It will clean up so much clutter in our React components.',
      parentComment: comment1._id,
    });

    // Comment on Tailwind post
    await Comment.create({
      blogId: seededBlogs[1]._id, // Tailwind post
      userId: writerJohn._id,
      comment: 'Tailwind has completely changed my CSS workflow. Highly recommend standardizing on v3!',
    });

    console.log('Seed comments and replies created successfully!');
    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
