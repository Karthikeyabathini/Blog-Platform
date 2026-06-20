# API Documentation - AuraBlog REST APIs

All requests use `/api` as base path. If authorization is required, send the token inside the header: `Authorization: Bearer <your_jwt_token>`.

---

## 🔑 Authentication Router (`/api/auth`)

### 1. Register User
* **Endpoint:** `POST /register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "60d052a2...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "avatar": "https://api.dicebear.com/..."
    }
  }
  ```

### 2. Login User
* **Endpoint:** `POST /login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
* **Success Response (200):** Same as Register.

### 3. Get Logged In User Profile
* **Endpoint:** `GET /profile`
* **Access:** Private
* **Success Response (200):**
  ```json
  {
    "success": true,
    "user": {
      "id": "60d052a2...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "avatar": "https://api.dicebear.com/...",
      "createdAt": "2026-06-20T..."
    }
  }
  ```

### 4. Update Profile
* **Endpoint:** `PUT /profile`
* **Access:** Private (Supports multipart/form-data for avatar upload)
* **Request Body (FormData):**
  * `name` (optional)
  * `email` (optional)
  * `password` (optional)
  * `avatar` (optional, File)
* **Success Response (200):** Updated user object.

---

## 📝 Blog Router (`/api/blogs`)

### 1. Get Blogs List (Paginated, Searchable, Filterable)
* **Endpoint:** `GET /`
* **Access:** Public
* **Query Parameters:**
  * `page` (default: 1)
  * `limit` (default: 6)
  * `category` (matches category name, e.g. `Technology`)
  * `search` (searches title, content, or tags)
  * `author` (filters by author user ID)
  * `status` (filters by status: `draft` or `published`. Defaults to `published` for public requests)
  * `bookmarkedBy` (filters blogs bookmarked by specific user ID)
* **Success Response (200):**
  ```json
  {
    "success": true,
    "count": 1,
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1
    },
    "blogs": [
      {
        "_id": "60d052a2...",
        "title": "Getting Started with React 19",
        "slug": "getting-started-with-react-19",
        "category": "Technology",
        "tags": ["React", "Vite"],
        "views": 25,
        "likes": [],
        "bookmarks": [],
        "author": {
          "_id": "60d052a2...",
          "name": "John Doe",
          "avatar": "..."
        }
      }
    ]
  }
  ```

### 2. Get Single Blog
* **Endpoint:** `GET /:id` (Supports query by MongoDB ObjectId OR title slug)
* **Access:** Public
* **Note:** Automatically increments the views count by 1.
* **Success Response (200):**
  ```json
  {
    "success": true,
    "blog": {
      "_id": "60d052a2...",
      "title": "Getting Started with React 19",
      "content": "<p>React 19 brings exciting new features...</p>",
      "views": 26,
      "readTime": 2,
      "...": "..."
    }
  }
  ```

### 3. Create Blog Post
* **Endpoint:** `POST /`
* **Access:** Private (Supports multipart/form-data for featuredImage upload)
* **Request Body (FormData):**
  * `title` (required)
  * `content` (required)
  * `category` (required)
  * `tags` (optional, stringified JSON array or comma-separated)
  * `status` (optional: `draft` or `published`. Default: `draft`)
  * `featuredImage` (optional, File)
* **Success Response (201):** Created blog object.

### 4. Update Blog Post
* **Endpoint:** `PUT /:id`
* **Access:** Private (Author only or Admin)
* **Request Body (FormData):** Any fields (title, content, category, tags, status, featuredImage).
* **Success Response (200):** Updated blog object.

### 5. Delete Blog Post
* **Endpoint:** `DELETE /:id`
* **Access:** Private (Author only or Admin)
* **Success Response (200):** Success message.

### 6. Like / Unlike Blog Post
* **Endpoint:** `PUT /:id/like`
* **Access:** Private (Toggles like status for the user)
* **Success Response (200):**
  ```json
  {
    "success": true,
    "likesCount": 1,
    "likes": ["60d052a2..."]
  }
  ```

### 7. Bookmark / Unbookmark Blog Post
* **Endpoint:** `PUT /:id/bookmark`
* **Access:** Private (Toggles bookmark status for the user)
* **Success Response (200):**
  ```json
  {
    "success": true,
    "bookmarksCount": 1,
    "bookmarks": ["60d052a2..."]
  }
  ```

---

## 💬 Comment Router (`/api/comments`)

### 1. Get Comments List for Blog Post
* **Endpoint:** `GET /:blogId`
* **Access:** Public
* **Success Response (200):** Ordered by creation date (newest first).
  ```json
  {
    "success": true,
    "count": 1,
    "comments": [
      {
        "_id": "60c052a2...",
        "blogId": "60d052a2...",
        "comment": "This is a great guide!",
        "parentComment": null,
        "userId": {
          "_id": "60d052a2...",
          "name": "Jane Smith",
          "avatar": "..."
        },
        "createdAt": "2026-06-20T..."
      }
    ]
  }
  ```

### 2. Add Comment (or Reply)
* **Endpoint:** `POST /:blogId`
* **Access:** Private
* **Request Body:**
  ```json
  {
    "comment": "I agree with Jane!",
    "parentComment": "60c052a2..." // pass parent comment ID to post a reply
  }
  ```
* **Success Response (201):** Created comment object.

### 3. Update Comment
* **Endpoint:** `PUT /:id`
* **Access:** Private (Comment owner only)
* **Request Body:**
  ```json
  {
    "comment": "Edited comment content..."
  }
  ```
* **Success Response (200):** Updated comment object.

### 4. Delete Comment
* **Endpoint:** `DELETE /:id`
* **Access:** Private (Comment owner or Admin)
* **Note:** Automatically cascades and deletes any nested replies referencing this comment as parent.
* **Success Response (200):** Success message.

---

## 🛡️ Admin Router (`/api/admin`)

Requires authentication and `'admin'` user role.

### 1. Get System Statistics Dashboard
* **Endpoint:** `GET /dashboard`
* **Success Response (200):**
  ```json
  {
    "success": true,
    "stats": {
      "totalUsers": 3,
      "totalBlogs": 5,
      "totalComments": 4,
      "publishedBlogs": 4,
      "draftBlogs": 1
    },
    "recentUsers": [...],
    "recentBlogs": [...]
  }
  ```

### 2. List All Users
* **Endpoint:** `GET /users`
* **Success Response (200):** List of all users.

### 3. Delete Any User
* **Endpoint:** `DELETE /users/:id`
* **Note:** Deletes user profile and cascades to delete all their articles and comments. Cannot delete yourself.

### 4. Delete Any Blog
* **Endpoint:** `DELETE /blogs/:id`

### 5. Delete Any Comment
* **Endpoint:** `DELETE /comments/:id`
