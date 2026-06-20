import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { FileText, Eye, Heart, Edit, Trash2, ArrowRight, Bookmark, Settings, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('published'); // published, draft, bookmarked
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    postsCount: 0,
    viewsCount: 0,
    likesCount: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'published') {
        url = `/blogs?author=${user.id}&status=published&limit=50`;
      } else if (activeTab === 'draft') {
        url = `/blogs?author=${user.id}&status=draft&limit=50`;
      } else if (activeTab === 'bookmarked') {
        url = `/blogs?bookmarkedBy=${user.id}&limit=50`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setBlogs(res.data.blogs);

        // If tab is published, we can compute stats for user's published work
        if (activeTab === 'published') {
          const views = res.data.blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
          const likes = res.data.blogs.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
          setStats({
            postsCount: res.data.pagination.total || res.data.blogs.length,
            viewsCount: views,
            likesCount: likes,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      showToast('Failed to load dashboard posts', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, showToast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await api.delete(`/blogs/${blogId}`);
      if (res.data.success) {
        showToast('Article deleted successfully', 'success');
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
        // Refresh stats
        if (activeTab === 'published') {
          setStats((prev) => ({
            ...prev,
            postsCount: prev.postsCount - 1,
          }));
        }
      }
    } catch (err) {
      showToast('Failed to delete article', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors duration-300">
      {/* Dashboard Top Banner */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* User profile details */}
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || '')}`}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Welcome, {user?.name}
                </h1>
                {user?.role === 'admin' && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-md uppercase border border-rose-100 dark:border-rose-900/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
            <div className="text-center">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Posts</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{stats.postsCount}</span>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-gray-700 px-4 sm:px-6">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{stats.viewsCount}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Likes</span>
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">{stats.likesCount}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main dashboard body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'published'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <FileText size={18} />
              Published Posts
            </button>

            <button
              onClick={() => setActiveTab('draft')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'draft'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <FileText size={18} className="opacity-60" />
              Drafts
            </button>

            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'bookmarked'
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <Bookmark size={18} />
              Bookmarks
            </button>

            <hr className="my-2 border-gray-100 dark:border-gray-800" />

            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850 transition-all"
            >
              <Settings size={18} />
              Edit Profile Settings
            </Link>
          </div>
        </div>

        {/* Content list container */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-250/50 pb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {activeTab === 'published'
                ? 'Published Articles'
                : activeTab === 'draft'
                ? 'My Drafts'
                : 'Bookmarked Articles'}
            </h2>
            <Link
              to="/create-blog"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-500/10"
            >
              Write New Post
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white dark:bg-gray-900 h-28 rounded-2xl border border-gray-150 animate-pulse"></div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 shadow-sm">
              <FileText size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'published'
                  ? "You haven't published any articles yet."
                  : activeTab === 'draft'
                  ? 'No drafts found. All clean!'
                  : "You haven't bookmarked any posts yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800/80 hover:border-gray-250 dark:hover:border-gray-700 shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                      {blog.category}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base hover:text-primary-500 truncate">
                      <Link to={`/blog/${blog.slug || blog._id}`}>{blog.title}</Link>
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-0.5">
                        <Eye size={12} />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Heart size={12} />
                        {blog.likes?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <Link
                      to={`/blog/${blog.slug || blog._id}`}
                      className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 transition-colors"
                      title="View Post"
                    >
                      <ArrowRight size={16} />
                    </Link>

                    {activeTab !== 'bookmarked' && (
                      <>
                        <Link
                          to={`/edit-blog/${blog._id}`}
                          className="p-2 border border-indigo-100 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-xl transition-colors"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 border border-red-100 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
