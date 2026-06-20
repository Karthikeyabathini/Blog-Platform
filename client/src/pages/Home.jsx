import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { Search, Compass, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Backend', 'Database', 'Lifestyle'];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Load URL queries if any (e.g. from footer categories)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
    const searchVal = params.get('search');
    if (searchVal) {
      setSearchQuery(searchVal);
    }
  }, [location.search]);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/blogs?page=${currentPage}&limit=6`;
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setBlogs(res.data.blogs);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalBlogs(res.data.pagination.total || 0);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleLikeToggle = (blogId, updatedLikes) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, likes: updatedLikes } : blog
      )
    );
  };

  const handleBookmarkToggle = (blogId, updatedBookmarks) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, bookmarks: updatedBookmarks } : blog
      )
    );
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const searchParams = new URLSearchParams();
    if (category !== 'All') {
      searchParams.set('category', category);
    }
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    }
    navigate({ search: searchParams.toString() });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const searchParams = new URLSearchParams();
    if (selectedCategory !== 'All') {
      searchParams.set('category', selectedCategory);
    }
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    }
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 text-white py-20 px-4">
        {/* Subtle decorative glow shapes */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="bg-primary-500/20 text-primary-300 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider border border-primary-500/30">
            AuraBlog Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Explore the World of{' '}
            <span className="bg-gradient-to-r from-primary-400 to-indigo-300 bg-clip-text text-transparent">
              Tech & Design
            </span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Dive into deep tech blogs, curated design tips, and scalable web solutions written by professional software developers.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center max-w-lg mx-auto bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-xl border border-white/10"
          >
            <div className="flex items-center pl-3 flex-grow text-gray-400">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search blogs by title, keywords or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-gray-800 dark:text-white px-3 focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth shrink-0 pr-4">
            <Compass size={18} className="text-gray-400 dark:text-gray-500 hidden sm:block" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/10'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium hidden md:block">
            Found {totalBlogs} blogs
          </span>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-4 animate-pulse">
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
            <Compass size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              We couldn't find any blogs matching your criteria. Try adjusting your category or search queries.
            </p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  navigate('/');
                }}
                className="mt-5 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onLikeToggle={handleLikeToggle}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                      currentPage === page
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/10'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
