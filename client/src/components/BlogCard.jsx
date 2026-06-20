import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Bookmark, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const BlogCard = ({ blog, onLikeToggle, onBookmarkToggle }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isLiked = user ? blog.likes?.includes(user.id) : false;
  const isBookmarked = user ? blog.bookmarks?.includes(user.id) : false;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to like blog posts!', 'error');
      return;
    }

    try {
      const res = await api.put(`/blogs/${blog._id}/like`);
      if (res.data.success && onLikeToggle) {
        onLikeToggle(blog._id, res.data.likes);
      }
    } catch (err) {
      showToast('Failed to like post', 'error');
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to bookmark blog posts!', 'error');
      return;
    }

    try {
      const res = await api.put(`/blogs/${blog._id}/bookmark`);
      if (res.data.success && onBookmarkToggle) {
        onBookmarkToggle(blog._id, res.data.bookmarks);
        showToast(
          res.data.bookmarks.includes(user.id)
            ? 'Added to Bookmarks'
            : 'Removed from Bookmarks',
          'success'
        );
      }
    } catch (err) {
      showToast('Failed to bookmark post', 'error');
    }
  };

  // Strip HTML tags for post snippet preview
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const textPreview = stripHtml(blog.content).slice(0, 120) + '...';

  // Read time calculation
  const estimateReadTime = (content) => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time < 1 ? 1 : time;
  };
  const readTime = estimateReadTime(blog.content);

  // Fallback featured image
  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
  const displayImage = blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : blog.featuredImage) : defaultImage;

  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Blog Featured Image */}
      <Link to={`/blog/${blog.slug || blog._id}`} className="relative block overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 shrink-0">
        <img
          src={displayImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Overlay */}
        <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {blog.category}
        </span>
      </Link>

      {/* Blog Contents */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {readTime} min read
            </span>
            <span>&bull;</span>
            <span>{formattedDate}</span>
          </div>

          {/* Title */}
          <Link to={`/blog/${blog.slug || blog._id}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          {/* Snippet */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {textPreview}
          </p>
        </div>

        {/* Footer info: Author, Views, Likes, Bookmarks */}
        <div className="border-t border-gray-100 dark:border-gray-800/80 mt-5 pt-4 flex items-center justify-between">
          {/* Author Details */}
          <div className="flex items-center gap-2">
            {blog.author?.avatar ? (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                <User size={14} />
              </div>
            )}
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
              {blog.author?.name || 'Anonymous'}
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1 text-xs" title="Views">
              <Eye size={14} />
              {blog.views}
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors hover:text-rose-500 ${
                isLiked ? 'text-rose-500 font-semibold' : ''
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
              {blog.likes?.length || 0}
            </button>

            <button
              onClick={handleBookmark}
              className={`transition-colors hover:text-indigo-500 ${
                isBookmarked ? 'text-indigo-500 font-semibold' : ''
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark size={14} className={isBookmarked ? 'fill-indigo-500 text-indigo-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
