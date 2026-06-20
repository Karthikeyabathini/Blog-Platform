import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import RichEditor from '../components/RichEditor';
import { FileText, Save, CheckCircle, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Technology', 'Design', 'Backend', 'Database', 'Lifestyle'];

const CreateBlog = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsText, setTagsText] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft'); // draft or published

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(''); // reset text input if file chosen
    }
  };

  const handleSave = async (e, forcedStatus = null) => {
    e.preventDefault();

    const blogStatus = forcedStatus || status;

    if (!title.trim()) {
      showToast('Title is required!', 'error');
      return;
    }
    if (!content.trim() || content === '<p></p>' || content === '<br>') {
      showToast('Content is required!', 'error');
      return;
    }

    // Split comma separated tags
    const tagsArray = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('status', blogStatus);
    formData.append('tags', JSON.stringify(tagsArray));

    if (imageFile) {
      formData.append('featuredImage', imageFile);
    } else if (imageUrl.trim()) {
      formData.append('featuredImage', imageUrl);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await api.post('/blogs', formData, config);

      if (res.data.success) {
        showToast(
          blogStatus === 'published'
            ? 'Article published successfully!'
            : 'Draft saved successfully!',
          'success'
        );
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create blog post', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Go back
        </button>

        {/* Page Title */}
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <FileText size={20} />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Create New Article
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your insights, ideas, and guides with the community.
            </p>
          </div>
        </div>

        {/* Main Editor Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title & Metadata Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Title input */}
              <div className="space-y-1 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full text-lg sm:text-xl font-bold bg-transparent border-0 border-b border-gray-100 dark:border-gray-800 focus:border-primary-500 focus:ring-0 focus:outline-none py-2 dark:text-white"
                  required
                />
              </div>

              {/* Rich Editor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">
                  Article Body
                </label>
                <RichEditor value={content} onChange={setContent} />
              </div>
            </div>

            {/* Sidebar Controls Right Column */}
            <div className="space-y-6">
              {/* Category & Tags Card */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Classification</h3>

                {/* Category select */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags input */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="react, css, frontend"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-gray-400" />
                  Featured Image
                </h3>

                {/* Image file upload */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    Upload File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-800 dark:file:text-primary-400"
                  />
                </div>

                {/* Or image url text */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                    Or Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null); // clear file preview
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white text-sm"
                  />
                </div>

                {/* Preview image */}
                {imagePreview && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Publish Controls Card */}
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Save Options</h3>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSave(e, 'draft')}
                    className="w-full bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Save size={16} />
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSave(e, 'published')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary-500/10"
                  >
                    <CheckCircle size={16} />
                    Publish Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
