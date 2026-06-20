import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-md shadow-md shadow-primary-500/20">
                A
              </span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-gray-900 via-primary-700 to-indigo-700 dark:from-white dark:via-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                AuraBlog
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              Discover and share insights on software engineering, visual design, database architectures, and production-ready deployments.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-primary-500 transition-colors" aria-label="Github"><Github size={18} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="hover:text-primary-500 transition-colors" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Home Feed
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/?category=Technology" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/?category=Design" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link to="/?category=Backend" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  Backend
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} AuraBlog. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" /> by Antigravity Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
