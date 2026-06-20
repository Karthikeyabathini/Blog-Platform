import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, FileWarning } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800/80">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
          <FileWarning size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Page Not Found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for does not exist or has been moved to another URL.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to="/"
            className="flex-grow bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 text-sm"
          >
            <Home size={16} />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-grow bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
