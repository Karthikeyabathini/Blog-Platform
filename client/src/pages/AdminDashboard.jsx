import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Users, BookOpen, MessageSquare, Trash2, ShieldAlert, Award, Grid, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, users, blogs

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  // Management tables data
  const [usersList, setUsersList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Stats & Recent Activity
  const fetchAdminStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentUsers(res.data.recentUsers || []);
        setRecentBlogs(res.data.recentBlogs || []);
      }
    } catch (err) {
      showToast('Error loading administrative statistics', 'error');
    }
  }, [showToast]);

  // Fetch Full Users list for management
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      showToast('Error loading users list', 'error');
    }
  }, [showToast]);

  // Fetch All Blogs list for management
  const fetchBlogs = useCallback(async () => {
    try {
      // Fetch all posts (both published and draft)
      const res = await api.get('/blogs?status=draft&limit=100'); // query drafts
      const res2 = await api.get('/blogs?status=published&limit=100'); // query published
      if (res.data.success && res2.data.success) {
        setBlogsList([...res.data.blogs, ...res2.data.blogs]);
      }
    } catch (err) {
      showToast('Error loading articles list', 'error');
    }
  }, [showToast]);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (activeTab === 'analytics') {
      await fetchAdminStats();
    } else if (activeTab === 'users') {
      await fetchUsers();
    } else if (activeTab === 'blogs') {
      await fetchBlogs();
    }
    setLoading(false);
  }, [activeTab, fetchAdminStats, fetchUsers, fetchBlogs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Delete handlers
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will permanently remove all their blog posts and comments. Continue?')) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        showToast('User removed successfully', 'success');
        setUsersList((prev) => prev.filter((u) => u._id !== userId));
        fetchAdminStats(); // refresh counts
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this article as admin?')) return;

    try {
      const res = await api.delete(`/admin/blogs/${blogId}`);
      if (res.data.success) {
        showToast('Article deleted successfully', 'success');
        setBlogsList((prev) => prev.filter((b) => b._id !== blogId));
        fetchAdminStats(); // refresh counts
      }
    } catch (err) {
      showToast('Failed to delete blog', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors duration-300">
      {/* Title block */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
            <ShieldAlert size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-white">Admin Control Panel</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">System management, analytics, user details, and content moderation.</p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'analytics'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <Grid size={18} />
              Stats & Analytics
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'users'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <Users size={18} />
              Manage Users
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${
                activeTab === 'blogs'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-850'
              }`}
            >
              <BookOpen size={18} />
              Manage Articles
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 h-28 rounded-2xl border border-gray-150 animate-pulse"></div>
              <div className="bg-white dark:bg-gray-900 h-40 rounded-2xl border border-gray-150 animate-pulse"></div>
            </div>
          ) : activeTab === 'analytics' ? (
            /* Tab: Stats Analytics */
            <div className="space-y-8">
              {/* Analytics Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Users Count Card */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalUsers}</span>
                  </div>
                </div>

                {/* Blogs Count Card */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen size={24} />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Blogs</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      {stats.totalBlogs}{' '}
                      <span className="text-xs text-gray-400 font-semibold">
                        ({stats.publishedBlogs} Pub / {stats.draftBlogs} Draft)
                      </span>
                    </span>
                  </div>
                </div>

                {/* Comments Count Card */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-950/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={24} />
                  </span>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Comments</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalComments}</span>
                  </div>
                </div>
              </div>

              {/* Activity details splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Users List */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                    Recent Signups
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {recentUsers.map((u) => (
                      <div key={u._id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded capitalize">
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Blogs List */}
                <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                    Recent Articles
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {recentBlogs.map((b) => (
                      <div key={b._id} className="py-3 flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <Link
                            to={`/blog/${b.slug || b._id}`}
                            className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary-500 truncate block"
                          >
                            {b.title}
                          </Link>
                          <p className="text-[10px] text-gray-400">By {b.author?.name || 'Anonymous'}</p>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded capitalize ${
                            b.status === 'published'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'users' ? (
            /* Tab: Users Management List */
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">Active Users Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              u.role === 'admin'
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 border border-red-100 hover:bg-red-50 text-red-600 dark:border-red-950/30 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab: Blogs Management List */
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">Active Articles Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Views</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {blogsList.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white min-w-[200px]">
                          <Link to={`/blog/${b.slug || b._id}`} className="hover:text-primary-500 hover:underline">
                            {b.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold">{b.category}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              b.status === 'published'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs">{b.views}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteBlog(b._id)}
                            className="p-1.5 border border-red-100 hover:bg-red-50 text-red-600 dark:border-red-950/30 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Delete Blog"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
