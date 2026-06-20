import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, ShieldAlert, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Image upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }

    if (password) {
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    }

    setLoading(true);

    // Build Form Data for multipart submission (due to avatar file)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
    }
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.success) {
      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } else {
      showToast(res?.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Go back
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <User size={20} />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your credentials, name, email, and visual appearance.
            </p>
          </div>
        </div>

        {/* Settings Body Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Avatar upload panel */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="relative group">
                <img
                  src={avatarPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-500/20 shadow-md"
                />
                <label className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-gray-950 dark:text-white">Profile Photo</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Upload an image (JPG, PNG, WEBP) up to 5MB. Hover photo to change.
                </p>
                <label className="inline-block mt-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline cursor-pointer">
                  Choose Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Simple Text Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Reset Card */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 pl-1">
                <ShieldAlert size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider">Change Password</h3>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                Leave password blank if you do not wish to change it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
