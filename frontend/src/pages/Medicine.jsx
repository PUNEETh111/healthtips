// ============================================================
// MEDICINE PAGE - Medicine reminder management
// Features: CRUD, search/filter, completion toggle, modal form
// ============================================================

import { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiSearch, FiFilter,
  FiClock, FiHeart, FiX, FiCheckCircle
} from 'react-icons/fi';
import { medicineAPI } from '../services/api';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

const Medicine = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterFreq, setFilterFreq] = useState('all');
  const [form, setForm] = useState({
    medicineName: '',
    dosage: '',
    time: '',
    frequency: 'daily',
    notes: ''
  });

  useEffect(() => {
    fetchReminders();
  }, [search, filterFreq]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterFreq !== 'all') params.frequency = filterFreq;
      const { data } = await medicineAPI.getAll(params);
      setReminders(data.data);
    } catch (error) {
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicineAPI.update(editingId, form);
        toast.success('Reminder updated successfully');
      } else {
        await medicineAPI.create(form);
        toast.success('Reminder created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchReminders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (reminder) => {
    setForm({
      medicineName: reminder.medicineName,
      dosage: reminder.dosage,
      time: reminder.time,
      frequency: reminder.frequency,
      notes: reminder.notes || ''
    });
    setEditingId(reminder._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await medicineAPI.delete(id);
      toast.success('Reminder deleted');
      fetchReminders();
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  const handleComplete = async (id) => {
    try {
      const { data } = await medicineAPI.complete(id);
      toast.success(data.message);
      fetchReminders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setForm({ medicineName: '', dosage: '', time: '', frequency: 'daily', notes: '' });
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Frequency label map
  const freqLabels = {
    once: 'Once',
    daily: 'Daily',
    twice_daily: 'Twice Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <FiHeart className="text-primary-500" /> Medicine Reminders
          </h1>
          <p className="page-subtitle">Manage your medicine schedule</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2" id="add-medicine-btn">
          <FiPlus className="w-5 h-5" /> Add Medicine
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines..."
            className="input-field pl-10 py-2.5"
            id="medicine-search"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterFreq}
            onChange={(e) => setFilterFreq(e.target.value)}
            className="select-field pl-10 py-2.5 pr-8 min-w-[160px]"
            id="medicine-filter"
          >
            <option value="all">All Frequencies</option>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Reminders Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Add your first medicine reminder to get started!</p>
          <button onClick={openAddModal} className="btn-primary mt-4">
            <FiPlus className="w-4 h-4 inline mr-2" /> Add Medicine
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reminders.map((r, idx) => (
            <div
              key={r._id}
              className={`glass-card p-5 card-hover animate-slide-up ${
                r.isCompleted ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-primary-500'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {/* Completion toggle */}
                  <button
                    onClick={() => handleComplete(r._id)}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      r.isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {r.isCompleted && <FiCheck className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-gray-900 dark:text-white ${
                      r.isCompleted ? 'line-through opacity-60' : ''
                    }`}>
                      {r.medicineName}
                    </h4>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      <span className="badge badge-info">{r.dosage}</span>
                      <span className="badge badge-warning flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> {r.time}
                      </span>
                      <span className="badge badge-success">{freqLabels[r.frequency]}</span>
                    </div>
                    {r.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{r.notes}</p>
                    )}
                    {r.isCompleted && r.completedAt && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Taken at {new Date(r.completedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingId ? 'Edit Medicine Reminder' : 'Add Medicine Reminder'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              value={form.medicineName}
              onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
              className="input-field"
              placeholder="e.g., Vitamin D3"
              required
              id="medicine-name-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dosage *
              </label>
              <input
                type="text"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                className="input-field"
                placeholder="e.g., 500mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency *
            </label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="select-field"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="e.g., Take after meals"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" id="medicine-submit-btn">
              {editingId ? 'Update Reminder' : 'Add Reminder'}
            </button>
            <button
              type="button"
              onClick={() => { setShowModal(false); resetForm(); }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Medicine;
