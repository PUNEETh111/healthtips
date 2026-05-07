// ============================================================
// PROFILE PAGE - User profile management
// Features: Edit name, water goal, account info, stats overview
// ============================================================

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiDroplet, FiEdit2, FiSave, FiShield, FiAward, FiCalendar, FiZap } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [dailyWaterGoal, setDailyWaterGoal] = useState(user?.dailyWaterGoal || 2000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDailyWaterGoal(user.dailyWaterGoal || 2000);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.updateProfile({ name, dailyWaterGoal });
      if (data.success) {
        updateUser({ name, dailyWaterGoal });
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const profileStats = [
    { icon: FiAward, label: 'Day Streak', value: `${user?.streak || 0} days`, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { icon: FiDroplet, label: 'Water Goal', value: `${dailyWaterGoal}ml`, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { icon: FiShield, label: 'Role', value: user?.role || 'user', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { icon: FiCalendar, label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-header flex items-center gap-2">
          <FiUser className="text-primary-500" /> My Profile
        </h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 relative">
          <div className="absolute inset-0 bg-black/10" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-4 h-4 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 }} />
            ))}
          </div>
        </div>

        {/* Avatar & Info */}
        <div className="px-6 pb-6 -mt-16 relative">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-gray-800">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="mt-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <FiMail className="w-4 h-4" /> {user?.email}
              </p>
              {user?.streak > 0 && (
                <p className="text-primary-500 font-medium text-sm mt-1 flex items-center gap-1">
                  <FiZap className="w-4 h-4" /> {user.streak} day streak! 🔥
                </p>
              )}
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={loading}
              className={editing ? 'btn-primary flex items-center gap-2' : 'btn-secondary flex items-center gap-2'}
              id="edit-profile-btn"
            >
              {editing ? (
                <>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSave className="w-4 h-4" />
                  )}
                  Save
                </>
              ) : (
                <>
                  <FiEdit2 className="w-4 h-4" /> Edit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {profileStats.map((stat, idx) => (
          <div key={idx} className="glass-card p-4 text-center card-hover">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="font-bold text-gray-900 dark:text-white capitalize">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <FiUser className="w-4 h-4 inline mr-1" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                id="profile-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <FiDroplet className="w-4 h-4 inline mr-1" /> Daily Water Goal (ml)
              </label>
              <input
                type="number"
                value={dailyWaterGoal}
                onChange={(e) => setDailyWaterGoal(parseInt(e.target.value))}
                className="input-field"
                min="500"
                max="10000"
                step="100"
                id="profile-water-goal"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 2000-3000ml per day</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <FiMail className="w-4 h-4 inline mr-1" /> Email (read-only)
              </label>
              <input
                type="email"
                value={user?.email || ''}
                className="input-field opacity-60 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2" id="save-profile-btn">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                Save Changes
              </button>
              <button onClick={() => { setEditing(false); setName(user?.name); setDailyWaterGoal(user?.dailyWaterGoal || 2000); }}
                className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Info */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Account Type</span>
            <span className="badge badge-info capitalize">{user?.role || 'user'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Activity Streak</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.streak || 0} days 🔥</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Daily Water Goal</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.dailyWaterGoal || 2000}ml</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
