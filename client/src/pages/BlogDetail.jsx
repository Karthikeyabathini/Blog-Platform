import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CommentSection from '../components/CommentSection';
import { Heart, Bookmark, Eye, Clock, Calendar, ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Likes & Bookmarks local state
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBlogDetails = useCallback(async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      if (res.data.success) {
        setBlog(res.data.blog);
        setLikes(res.data.blog.likes || []);
        setBookmarks(res.data.blog.bookmarks || []);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error loading blog post', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showToast]);

  useEffect(() => {
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  const handleLike = async () => {
    if (!user) {
      showToast('Please sign in to like this post!', 'error');
      return;
    }

    try {
      const res = await api.put(`/blogs/${blog._id}/like`);
      if (res.data.success) {
        setLikes(res.data.likes);
      }
    } catch (err) {
      showToast('Failed to toggle like', 'error');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      showToast('Please sign in to bookmark this post!', 'error');
      return;
    }

    try {
      const res = await api.put(`/blogs/${blog._id}/bookmark`);
      if (res.data.success) {
        setBookmarks(res.data.bookmarks);
        showToast(
          res.data.bookmarks.includes(user.id)
            ? 'Saved to bookmarks'
            : 'Removed from bookmarks',
          'success'
        );
      }
    } catch (err) {
      showToast('Failed to toggle bookmark', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await api.delete(`/blogs/${blog._id}`);
      if (res.data.success) {
        showToast('Blog post deleted successfully', 'success');
        navigate('/');
      }
    } catch (err) {
      showToast('Failed to delete blog post', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  const isLiked = user ? likes.includes(user.id) : false;
  const isBookmarked = user ? bookmarks.includes(user.id) : false;
  const isAuthor = user && blog.author?._id === user.id;
  const canEditOrDelete = isAuthor || (user && user.role === 'admin');

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors duration-300">
      {/* Blog Detail Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 font-semibold transition-colors">
          <ArrowLeft size={16} />
          Back to feed
        </Link>

        {/* Categories / Tags */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase border border-primary-100 dark:border-primary-900/30">
            {blog.category}
          </span>

          {/* Edit/Delete if Owner/Admin */}
          {canEditOrDelete && (
            <div className="flex items-center gap-2">
              {isAuthor && (
                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 transition-all"
                >
                  <Edit2 size={12} />
                  Edit Post
                </Link>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 px-3 py-1.5 rounded-xl border border-red-100 dark:border-red-900/30 transition-all"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
          {blog.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-between border-y border-gray-200/50 dark:border-gray-800/50 py-4 gap-4">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={blog.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(blog.author?.name || 'User')}`}
              alt={blog.author?.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{blog.author?.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Author &bull; {blog.author?.role}</p>
            </div>
          </div>

          {/* Post details */}
          <div className="flex items-center gap-6 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {blog.readTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {blog.views} views
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="aspect-video rounded-3xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-850">
            <img
              src={blog.featuredImage.startsWith('http') ? blog.featuredImage : blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="max-w-3xl mx-auto py-6">
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-base md:text-lg leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Likes & Bookmarks floating/bottom control card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 mt-8 flex items-center justify-between shadow-sm">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Enjoyed this article?
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${
                  isLiked
                    ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-rose-500' : ''} />
                {likes.length} Likes
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${
                  isBookmarked
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-500 dark:bg-indigo-950/20 dark:border-indigo-900/30'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-indigo-500' : ''} />
                {isBookmarked ? 'Bookmarked' : 'Save'}
              </button>
            </div>
          </div>

          {/* Comment Section container */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
            <CommentSection blogId={blog._id} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
