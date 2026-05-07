// ============================================================
// WATER TRACKER PAGE - Daily water intake tracking
// Features: Quick-add buttons, progress bar, daily log, weekly chart
// ============================================================

import { useState, useEffect } from 'react';
import { FiDroplet, FiPlus, FiTrash2, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { waterAPI } from '../services/api';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

const Water = () => {
  const [todayData, setTodayData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [todayRes, weeklyRes] = await Promise.all([
        waterAPI.getToday(),
        waterAPI.getWeekly()
      ]);
      setTodayData(todayRes.data.data);
      setWeeklyData(weeklyRes.data.data);
    } catch (error) {
      toast.error('Failed to load water data');
    } finally {
      setLoading(false);
    }
  };

  const logWater = async (amount) => {
    try {
      const { data } = await waterAPI.log({ amount });
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error('Failed to log water');
    }
  };

  const handleCustomLog = (e) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (amount > 0) {
      logWater(amount);
      setCustomAmount('');
    }
  };

  const deleteEntry = async (id) => {
    try {
      await waterAPI.delete(id);
      toast.success('Entry deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const updateGoal = async (e) => {
    e.preventDefault();
    try {
      await waterAPI.updateGoal({ dailyWaterGoal: parseInt(newGoal) });
      toast.success('Goal updated!');
      setShowGoalModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
    }
  };

  // Quick-add amounts
  const quickAmounts = [
    { label: '🥛 Glass', amount: 250, icon: '250ml' },
    { label: '🍶 Bottle', amount: 500, icon: '500ml' },
    { label: '🫗 Large', amount: 750, icon: '750ml' },
    { label: '🧊 Sip', amount: 100, icon: '100ml' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const percentage = todayData?.percentage || 0;
  const totalAmount = todayData?.totalAmount || 0;
  const goal = todayData?.goal || 2000;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <FiDroplet className="text-blue-500" /> Water Tracker
          </h1>
          <p className="page-subtitle">Stay hydrated throughout the day</p>
        </div>
        <button
          onClick={() => { setNewGoal(goal.toString()); setShowGoalModal(true); }}
          className="btn-secondary flex items-center gap-2"
          id="update-goal-btn"
        >
          <FiTarget className="w-4 h-4" /> Set Goal
        </button>
      </div>

      {/* Main Progress Section */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor"
                className="text-gray-100 dark:text-gray-700" strokeWidth="10" />
              {/* Progress circle */}
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#waterProgressGradient)"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="waterProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">hydrated</span>
              <span className="text-sm font-medium text-blue-500 mt-1">{totalAmount}ml</span>
            </div>
          </div>

          {/* Info & Quick Add */}
          <div className="flex-1 w-full">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalAmount}ml / {goal}ml</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-1000 animate-progress"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                {percentage >= 100
                  ? '🎉 Daily goal reached! Amazing!'
                  : `${goal - totalAmount}ml remaining to reach your goal`
                }
              </p>
            </div>

            {/* Quick Add Buttons */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Add:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickAmounts.map((item) => (
                <button
                  key={item.amount}
                  onClick={() => logWater(item.amount)}
                  className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30
                  hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-center group"
                >
                  <span className="text-lg block group-hover:scale-110 transition-transform">{item.label.split(' ')[0]}</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{item.icon}</span>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <form onSubmit={handleCustomLog} className="mt-3 flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom ml..."
                className="input-field py-2 flex-1"
                min="1"
                max="5000"
                id="custom-water-input"
              />
              <button type="submit" className="btn-primary py-2 px-4" id="log-water-btn">
                <FiPlus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-blue-500" />
            Weekly Intake
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
                  formatter={(value) => [`${value}ml`, 'Water']}
                />
                <ReferenceLine y={goal} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Goal', position: 'right', fontSize: 11, fill: '#ef4444' }} />
                <Bar dataKey="totalAmount" name="Water (ml)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="glass-card p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Log ({todayData?.entryCount || 0} entries)
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {todayData?.entries?.length > 0 ? (
              todayData.entries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FiDroplet className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{entry.amount}ml</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                    opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FiDroplet className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No entries yet today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Update Daily Water Goal" size="sm">
        <form onSubmit={updateGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Daily Goal (ml)
            </label>
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="input-field"
              min="500"
              max="10000"
              step="100"
              required
              id="water-goal-input"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 2000-3000ml per day</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Update Goal</button>
            <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Water;
