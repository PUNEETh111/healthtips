// ============================================================
// EXERCISE PAGE - Exercise reminder management
// Features: CRUD, type filter, completion, calorie tracking
// ============================================================

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiSearch, FiActivity, FiClock, FiZap } from 'react-icons/fi';
import { exerciseAPI } from '../services/api';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({
    exerciseName: '',
    exerciseType: 'cardio',
    duration: 30,
    reminderTime: '',
    frequency: 'daily',
    calories: 0,
    notes: ''
  });

  useEffect(() => {
    fetchExercises();
  }, [search, filterType]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterType !== 'all') params.type = filterType;
      const { data } = await exerciseAPI.getAll(params);
      setExercises(data.data);
    } catch (error) {
      toast.error('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await exerciseAPI.update(editingId, form);
        toast.success('Exercise updated!');
      } else {
        await exerciseAPI.create(form);
        toast.success('Exercise added!');
      }
      setShowModal(false);
      resetForm();
      fetchExercises();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (ex) => {
    setForm({
      exerciseName: ex.exerciseName,
      exerciseType: ex.exerciseType,
      duration: ex.duration,
      reminderTime: ex.reminderTime,
      frequency: ex.frequency,
      calories: ex.calories || 0,
      notes: ex.notes || ''
    });
    setEditingId(ex._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exercise?')) return;
    try {
      await exerciseAPI.delete(id);
      toast.success('Exercise deleted');
      fetchExercises();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleComplete = async (id) => {
    try {
      const { data } = await exerciseAPI.complete(id);
      toast.success(data.message);
      fetchExercises();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const resetForm = () => {
    setForm({
      exerciseName: '', exerciseType: 'cardio', duration: 30,
      reminderTime: '', frequency: 'daily', calories: 0, notes: ''
    });
    setEditingId(null);
  };

  // Type styling
  const typeStyles = {
    cardio: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', emoji: '🏃' },
    strength: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', emoji: '💪' },
    flexibility: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', emoji: '🧘' },
    balance: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', emoji: '⚖️' },
    sports: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', emoji: '⚽' },
    other: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', emoji: '🏋️' }
  };

  const freqLabels = { once: 'Once', daily: 'Daily', weekly: 'Weekly', weekdays: 'Weekdays', weekends: 'Weekends' };

  // Stats
  const completed = exercises.filter(e => e.isCompleted).length;
  const totalCalories = exercises.filter(e => e.isCompleted).reduce((sum, e) => sum + (e.calories || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <FiActivity className="text-green-500" /> Exercise Reminders
          </h1>
          <p className="page-subtitle">Schedule and track your workouts</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2" id="add-exercise-btn">
          <FiPlus className="w-5 h-5" /> Add Exercise
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{exercises.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Exercises</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{completed}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{totalCalories}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Calories Burned</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="input-field pl-10 py-2.5"
            id="exercise-search"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="select-field py-2.5 min-w-[140px]"
          id="exercise-type-filter"
        >
          <option value="all">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
          <option value="balance">Balance</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Exercise List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : exercises.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🏃</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Exercises Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start tracking your workouts!</p>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary mt-4">
            <FiPlus className="w-4 h-4 inline mr-2" /> Add Exercise
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {exercises.map((ex, idx) => {
            const style = typeStyles[ex.exerciseType] || typeStyles.other;
            return (
              <div
                key={ex._id}
                className={`glass-card p-5 card-hover animate-slide-up ${
                  ex.isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-orange-400'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleComplete(ex._id)}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        ex.isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                      }`}
                    >
                      {ex.isCompleted && <FiCheck className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold text-gray-900 dark:text-white ${ex.isCompleted ? 'line-through opacity-60' : ''}`}>
                          {ex.exerciseName}
                        </h4>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                        <span className={`badge ${style.bg} ${style.text}`}>
                          {style.emoji} {ex.exerciseType}
                        </span>
                        <span className="badge badge-warning flex items-center gap-1">
                          <FiClock className="w-3 h-3" /> {ex.reminderTime}
                        </span>
                        <span className="badge badge-info">{ex.duration} min</span>
                        {ex.calories > 0 && (
                          <span className="badge badge-danger flex items-center gap-1">
                            <FiZap className="w-3 h-3" /> {ex.calories} cal
                          </span>
                        )}
                        <span className="badge badge-success">{freqLabels[ex.frequency]}</span>
                      </div>
                      {ex.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{ex.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => handleEdit(ex)}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ex._id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingId ? 'Edit Exercise' : 'Add Exercise'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercise Name *</label>
            <input type="text" value={form.exerciseName} onChange={(e) => setForm({ ...form, exerciseName: e.target.value })}
              className="input-field" placeholder="e.g., Morning Jog" required id="exercise-name-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.exerciseType} onChange={(e) => setForm({ ...form, exerciseType: e.target.value })} className="select-field">
                <option value="cardio">🏃 Cardio</option>
                <option value="strength">💪 Strength</option>
                <option value="flexibility">🧘 Flexibility</option>
                <option value="balance">⚖️ Balance</option>
                <option value="sports">⚽ Sports</option>
                <option value="other">🏋️ Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time *</label>
              <input type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
                className="input-field" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                className="input-field" min="5" max="300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
              <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: parseInt(e.target.value) || 0 })}
                className="input-field" min="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="select-field">
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field resize-none" rows={2} placeholder="Optional notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" id="exercise-submit-btn">
              {editingId ? 'Update' : 'Add Exercise'}
            </button>
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exercise;
