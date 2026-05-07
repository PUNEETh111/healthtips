// ============================================================
// DASHBOARD PAGE - Main analytics dashboard
// Features: Stats cards, charts, health score, daily tip, quote
// ============================================================

import { useState, useEffect } from 'react';
import { FiHeart, FiDroplet, FiActivity, FiTrendingUp, FiAward, FiZap, FiStar } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { dashboardAPI, tipsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, weeklyRes, tipRes, quoteRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getWeekly(),
        tipsAPI.getRandom(),
        dashboardAPI.getQuote()
      ]);

      setStats(statsRes.data.data);
      setWeeklyData(weeklyRes.data.data);
      setDailyTip(tipRes.data.data);
      setQuote(quoteRes.data.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = [
    { name: 'Water', value: stats?.waterPercentage || 0, color: '#3b82f6' },
    { name: 'Medicine', value: stats?.medicineCompletionRate || 0, color: '#8b5cf6' },
    { name: 'Exercise', value: stats?.exerciseCompletionRate || 0, color: '#22c55e' },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: 'Health Score',
      value: `${stats?.healthScore || 0}%`,
      subtitle: 'Overall wellness',
      icon: FiAward,
      gradient: 'stat-gradient-1',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Water Intake',
      value: `${stats?.waterIntakeToday || 0}ml`,
      subtitle: `Goal: ${stats?.waterGoal || 2000}ml (${stats?.waterPercentage || 0}%)`,
      icon: FiDroplet,
      gradient: 'stat-gradient-2',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Medicines',
      value: `${stats?.completedMedicines || 0}/${stats?.totalMedicines || 0}`,
      subtitle: `${stats?.medicineCompletionRate || 0}% completed`,
      icon: FiHeart,
      gradient: 'stat-gradient-3',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Exercises',
      value: `${stats?.completedExercises || 0}/${stats?.totalExercises || 0}`,
      subtitle: `${stats?.exerciseCompletionRate || 0}% completed`,
      icon: FiActivity,
      gradient: 'stat-gradient-4',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Day Streak',
      value: `${stats?.streak || 0} 🔥`,
      subtitle: 'Keep it up!',
      icon: FiZap,
      gradient: 'stat-gradient-5',
      iconBg: 'bg-white/20'
    },
    {
      title: 'Wellness',
      value: stats?.healthScore >= 70 ? 'Great!' : stats?.healthScore >= 40 ? 'Good' : 'Improve',
      subtitle: 'Daily status',
      icon: FiStar,
      gradient: 'stat-gradient-6',
      iconBg: 'bg-white/20'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">Your daily wellness overview</p>
      </div>

      {/* Motivational Quote */}
      {quote && (
        <div className="glass-card p-5 border-l-4 border-primary-500">
          <p className="text-gray-700 dark:text-gray-300 italic text-sm md:text-base">
            "{quote.text}"
          </p>
          <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mt-2">
            — {quote.author}
          </p>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.gradient} rounded-2xl p-4 text-white card-hover animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-white/80 mt-0.5 font-medium">{card.title}</p>
            <p className="text-xs text-white/60 mt-0.5">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Intake Trend Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiDroplet className="text-blue-500" />
            Water Intake Trend (7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '13px'
                  }}
                  formatter={(value) => [`${value}ml`, 'Water']}
                />
                <Area
                  type="monotone"
                  dataKey="water"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#waterGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Completion Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiActivity className="text-green-500" />
            Weekly Activity Summary
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '13px'
                  }}
                />
                <Bar dataKey="medicineCompleted" name="Medicine" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exerciseCompleted" name="Exercise" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Health Score Pie + Daily Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellness Distribution Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary-500" />
            Wellness Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value) => [`${value}%`, 'Completion']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Health Tip */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            💡 Daily Health Tip
          </h3>
          {dailyTip ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/30">
                <span className="text-3xl mb-3 block">{dailyTip.icon || '💡'}</span>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {dailyTip.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {dailyTip.content}
                </p>
                <span className="inline-block mt-3 badge badge-info capitalize">
                  {dailyTip.category?.replace('_', ' ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              No tips available. Add some health tips!
            </div>
          )}
        </div>
      </div>

      {/* Water Progress Bar */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <FiDroplet className="text-blue-500" />
          Today's Hydration Progress
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 animate-progress"
                style={{ width: `${stats?.waterPercentage || 0}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {stats?.waterIntakeToday || 0}ml / {stats?.waterGoal || 2000}ml
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {stats?.waterPercentage >= 100
            ? '🎉 Goal reached! Great hydration today!'
            : `${100 - (stats?.waterPercentage || 0)}% more to reach your daily goal`
          }
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
