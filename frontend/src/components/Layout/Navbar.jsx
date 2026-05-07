// ============================================================
// NAVBAR COMPONENT - Top navigation bar
// Features: Dark mode toggle, search, mobile menu toggle
// ============================================================

import { FiMenu, FiSun, FiMoon, FiBell, FiSearch } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();

  // Get current greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left: Menu button + Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            id="mobile-menu-toggle"
          >
            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="hidden sm:block">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {getGreeting()} 👋
            </h2>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.name || 'User'}
            </p>
          </div>
        </div>

        {/* Center: Search bar (hidden on small screens) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reminders, tips..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all
              text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              id="global-search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            id="notifications-btn"
          >
            <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            id="dark-mode-toggle"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-yellow-500 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-primary-500/25 transition-shadow">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
