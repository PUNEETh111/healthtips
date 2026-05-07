// ============================================================
// SIDEBAR COMPONENT - Navigation sidebar with healthcare icons
// Features: Responsive, collapsible on mobile, active state
// ============================================================

import { NavLink } from 'react-router-dom';
import {
  FiHome, FiHeart, FiDroplet, FiActivity, FiBookOpen,
  FiUser, FiX, FiLogOut, FiZap
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

/**
 * Navigation items configuration
 */
const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/medicines', icon: FiHeart, label: 'Medicines' },
  { path: '/water', icon: FiDroplet, label: 'Water Tracker' },
  { path: '/exercises', icon: FiActivity, label: 'Exercises' },
  { path: '/health-tips', icon: FiBookOpen, label: 'Health Tips' },
  { path: '/profile', icon: FiUser, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo & Brand */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Health<span className="text-gradient">Hub</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Wellness Dashboard</p>
              </div>
            </div>
            {/* Close button (mobile only) */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* User info card */}
        <div className="px-4 py-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            {user?.streak > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium">
                <span>🔥</span>
                <span>{user.streak} day streak!</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
