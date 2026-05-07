// ============================================================
// HEALTH TIPS PAGE - Browse and manage health tips
// Features: Category filter, admin CRUD, daily tips, search
// ============================================================

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBookOpen, FiRefreshCw } from 'react-icons/fi';
import { tipsAPI } from '../services/api';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

const HealthTips = () => {
  const [tips, setTips] = useState([]);
  const [dailyTips, setDailyTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'fitness',
    icon: '💡'
  });

  useEffect(() => {
    fetchDailyTips();
    fetchAllTips();
  }, []);

  useEffect(() => {
    fetchAllTips();
  }, [category, search]);

  const fetchDailyTips = async () => {
    try {
      const { data } = await tipsAPI.getDaily();
      setDailyTips(data.data);
    } catch (error) {
      console.error('Failed to fetch daily tips');
    }
  };

  const fetchAllTips = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const { data } = await tipsAPI.getAll(params);
      setTips(data.data);
    } catch (error) {
      toast.error('Failed to load tips');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await tipsAPI.update(editingId, form);
        toast.success('Tip updated!');
      } else {
        await tipsAPI.create(form);
        toast.success('Tip created!');
      }
      setShowModal(false);
      resetForm();
      fetchAllTips();
      fetchDailyTips();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (tip) => {
    setForm({
      title: tip.title,
      content: tip.content,
      category: tip.category,
      icon: tip.icon || '💡'
    });
    setEditingId(tip._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this health tip?')) return;
    try {
      await tipsAPI.delete(id);
      toast.success('Tip deleted');
      fetchAllTips();
      fetchDailyTips();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setForm({ title: '', content: '', category: 'fitness', icon: '💡' });
    setEditingId(null);
  };

  // Category config
  const categories = [
    { value: 'all', label: 'All', emoji: '📋' },
    { value: 'fitness', label: 'Fitness', emoji: '🏃' },
    { value: 'nutrition', label: 'Nutrition', emoji: '🥗' },
    { value: 'mental_health', label: 'Mental Health', emoji: '🧠' },
    { value: 'sleep', label: 'Sleep', emoji: '😴' },
    { value: 'hydration', label: 'Hydration', emoji: '💧' },
  ];

  const categoryColors = {
    fitness: 'from-red-500 to-orange-500',
    nutrition: 'from-green-500 to-emerald-500',
    mental_health: 'from-purple-500 to-indigo-500',
    sleep: 'from-blue-500 to-indigo-500',
    hydration: 'from-cyan-500 to-blue-500',
  };

  const iconOptions = ['💡', '🏃', '🥗', '🧠', '😴', '💧', '❤️', '🌟', '🔥', '🎯', '🧘', '🍎', '💪', '🌙', '☀️'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <FiBookOpen className="text-purple-500" /> Health Tips
          </h1>
          <p className="page-subtitle">Daily wellness advice for a healthier you</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2" id="add-tip-btn">
          <FiPlus className="w-5 h-5" /> Add Tip
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          ✨ Today's Tips
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          📚 All Tips ({tips.length})
        </button>
      </div>

      {/* Daily Tips View */}
      {activeTab === 'daily' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🌟 Your Daily Health Tips
            </h3>
            <button onClick={fetchDailyTips} className="btn-secondary flex items-center gap-1 text-sm py-2 px-3">
              <FiRefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
          {dailyTips.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dailyTips.map((tip, idx) => (
                <div
                  key={tip._id}
                  className={`rounded-2xl p-5 text-white card-hover animate-slide-up bg-gradient-to-br ${
                    categoryColors[tip.category] || 'from-gray-500 to-gray-600'
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-3xl mb-3">{tip.icon || '💡'}</div>
                  <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
                  <p className="text-sm text-white/90 leading-relaxed">{tip.content}</p>
                  <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20">
                    {tip.category?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Tips Available</h3>
              <p className="text-gray-500 mt-2">Add some health tips to see daily suggestions!</p>
            </div>
          )}
        </div>
      )}

      {/* All Tips View */}
      {activeTab === 'all' && (
        <div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tips..."
              className="input-field pl-10"
              id="tips-search"
            />
          </div>

          {/* Tips Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : tips.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500">No tips found for this filter.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip, idx) => (
                <div
                  key={tip._id}
                  className="glass-card p-5 card-hover animate-slide-up group"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{tip.icon || '💡'}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(tip)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(tip._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mt-2">{tip.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">{tip.content}</p>
                  <span className="inline-block mt-3 badge badge-info capitalize">
                    {tip.category?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingId ? 'Edit Health Tip' : 'Add Health Tip'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="e.g., Stay Hydrated" required id="tip-title-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-field resize-none" rows={3} placeholder="Write your health tip..." required minLength={10} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="select-field">
                <option value="fitness">🏃 Fitness</option>
                <option value="nutrition">🥗 Nutrition</option>
                <option value="mental_health">🧠 Mental Health</option>
                <option value="sleep">😴 Sleep</option>
                <option value="hydration">💧 Hydration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      form.icon === icon
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" id="tip-submit-btn">
              {editingId ? 'Update Tip' : 'Add Tip'}
            </button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HealthTips;
