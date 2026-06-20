# AuraBlog | Modern Full-Stack Blog Platform

A modern, production-ready Full-Stack Blogging Platform with comments, user settings, admin moderation panel, and dark/light modes. Built using **React.js (Vite)**, **Node.js (Express.js)**, and **MongoDB (Mongoose)**.

## 🚀 Key Features

* **User Authentication:** Registration, login, secure session persistence (localStorage + Axios header configuration), and password hashing via `bcryptjs`.
* **Dark / Light Mode:** Adaptive color switching with local persistence.
* **Premium Typography & UI:** Integrated Google Fonts (Inter), smooth transitions, glassmorphic blur navigation, custom scrollbars, and visual micro-animations.
* **Core Blog Engine (CRUD):** 
  * Create, edit, list, and delete blog posts.
  * Published/Draft status management.
  * Image file uploads (via Multer) or text-based URLs.
  * Reading time estimator & view counter.
  * Like and Bookmark systems with real-time updates.
* **Category & Tags Filtering:** Category navigation tabs (Technology, Design, Backend, etc.) and search filters with full frontend-backend integration.
* **Threaded Comment System:** Supporting comment submissions, editing/deleting own comments, and 1-level nested replies.
* **Admin Dashboard:** Total system metrics, user directory moderation, and content deletion tools.
* **Global Security Standards:** Enabled CORS, Helmet header protections, MongoDB query sanitizations, and API rate-limiting rules.
* **Toast Notification Context:** Custom CSS animated popup banner alerts.

---

## 📂 Project Structure

```text
client/                  # Frontend App (Vite + React)
├── public/
├── src/
│   ├── components/      # Reusable UI Blocks (Navbar, BlogCard, CommentSection, etc.)
│   ├── context/         # Auth, Theme, and Toast Context state providers
│   ├── pages/           # Page Layouts (Home, BlogDetail, AdminDashboard, etc.)
│   ├── services/        # Axios API Client setup
│   ├── App.jsx          # Routes definition and main Layout wrapper
│   ├── index.css        # Tailwind config imports & scrollbar styles
│   └── main.jsx         # Client mount point
├── index.html
├── tailwind.config.js
└── vite.config.js

server/                  # Backend REST API (Express.js)
├── config/              # DB connection setups
├── controllers/         # Business logic (Auth, Blog, Comment, Admin)
├── middleware/          # Security headers, uploads, validations, error filters
├── models/              # Mongoose DB schemas (User, Blog, Comment)
├── routes/              # Express API routers
├── scripts/             # DB Seeding script
├── uploads/             # Locally stored image uploads
├── .env.example
├── .env                 # Server env variables
└── server.js            # Express Entrypoint
```

---

## 🛠️ Getting Started

Follow these steps to run the application locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (running locally or a remote MongoDB Atlas URI)

---

### Step 1: Clone and Set Up the Server

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Verify the database connection in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/blog-platform
   JWT_SECRET=super_random_secret_string
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

---

### Step 2: Seed the Database

Before starting the server, you can populate MongoDB with sample users, articles, comments, and replies:

```bash
# Inside the server/ directory
npm run seed
```

This will create:
* **Admin User:** `admin@blog.com` / `adminpassword`
* **Standard User 1:** `john@blog.com` / `password123`
* **Standard User 2:** `jane@blog.com` / `password123`
* 4 sample articles (React 19, Tailwind CSS, REST API design, etc.)
* Nested discussions on React 19 article.

---

### Step 3: Run the Server

Start the backend API server in development mode (using Nodemon):

```bash
# Inside the server/ directory
npm run dev
```
The server will boot on `http://localhost:5000`.

---

### Step 4: Set Up and Run the Client

1. Open a new terminal window and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
The development server will launch on `http://localhost:3000`. Any requests to `/api` or `/uploads` are automatically proxied to the Express API on port 5000.

---

## 🛡️ Security Checklists
* **NoSQL Injection protection** via `express-mongo-sanitize`.
* **Cross-Origin Resource Sharing (CORS)** enabled.
* **Helmet** is used to set secure HTTP headers.
* **Rate Limiter** limits each IP to a max of 100 requests per 10 minutes.
* **Password Hashing** via `bcryptjs` (salt factor 10) with password exclusion in DB fetches.
* **JWT token guards** in authentication authorization middleware.
