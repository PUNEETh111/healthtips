// ============================================================
// MEDICINE CONTROLLER
// Handles CRUD operations for medicine reminders
// Demonstrates: CRUD, Filtering, Sorting, Transactions
// ============================================================

const MedicineReminder = require('../models/MedicineReminder');
const mongoose = require('mongoose');

/**
 * @route   POST /api/medicines
 * @desc    Create a new medicine reminder
 * @access  Private
 */
const createReminder = async (req, res) => {
  try {
    const { medicineName, dosage, time, frequency, notes } = req.body;

    // Validate required fields
    if (!medicineName || !dosage || !time) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name, dosage, and time are required'
      });
    }

    const reminder = await MedicineReminder.create({
      userId: req.user._id,
      medicineName,
      dosage,
      time,
      frequency: frequency || 'daily',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Medicine reminder created successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Create medicine reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating reminder'
    });
  }
};

/**
 * @route   GET /api/medicines
 * @desc    Get all medicine reminders for the logged-in user
 * @access  Private
 * Supports: search, filter by frequency, sort
 */
const getReminders = async (req, res) => {
  try {
    const { search, frequency, completed, sort } = req.query;

    // Build query filter (equivalent to SQL WHERE clause)
    const filter = { userId: req.user._id };

    // Search filter (equivalent to SQL LIKE)
    if (search) {
      filter.medicineName = { $regex: search, $options: 'i' };
    }

    // Frequency filter
    if (frequency && frequency !== 'all') {
      filter.frequency = frequency;
    }

    // Completion status filter
    if (completed === 'true') filter.isCompleted = true;
    if (completed === 'false') filter.isCompleted = false;

    // Sort configuration (equivalent to SQL ORDER BY)
    let sortOption = { createdAt: -1 };  // Default: newest first
    if (sort === 'name') sortOption = { medicineName: 1 };
    if (sort === 'time') sortOption = { time: 1 };

    const reminders = await MedicineReminder.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reminders'
    });
  }
};

/**
 * @route   GET /api/medicines/:id
 * @desc    Get a single medicine reminder by ID
 * @access  Private
 */
const getReminderById = async (req, res) => {
  try {
    const reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      userId: req.user._id  // Ensures user can only access their own data
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Medicine reminder not found'
      });
    }

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('Get reminder by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reminder'
    });
  }
};

/**
 * @route   PUT /api/medicines/:id
 * @desc    Update a medicine reminder
 * @access  Private
 */
const updateReminder = async (req, res) => {
  try {
    const { medicineName, dosage, time, frequency, notes, isActive } = req.body;

    const reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Medicine reminder not found'
      });
    }

    // Update fields if provided
    if (medicineName) reminder.medicineName = medicineName;
    if (dosage) reminder.dosage = dosage;
    if (time) reminder.time = time;
    if (frequency) reminder.frequency = frequency;
    if (notes !== undefined) reminder.notes = notes;
    if (isActive !== undefined) reminder.isActive = isActive;

    await reminder.save();

    res.json({
      success: true,
      message: 'Medicine reminder updated successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating reminder'
    });
  }
};

/**
 * @route   PATCH /api/medicines/:id/complete
 * @desc    Mark a medicine reminder as completed
 * @access  Private
 */
const completeReminder = async (req, res) => {
  try {
    const reminder = await MedicineReminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Medicine reminder not found'
      });
    }

    // Toggle completion status
    reminder.isCompleted = !reminder.isCompleted;
    reminder.completedAt = reminder.isCompleted ? new Date() : null;

    await reminder.save();

    res.json({
      success: true,
      message: reminder.isCompleted
        ? 'Medicine marked as taken ✅'
        : 'Medicine marked as not taken',
      data: reminder
    });
  } catch (error) {
    console.error('Complete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing reminder'
    });
  }
};

/**
 * @route   DELETE /api/medicines/:id
 * @desc    Delete a medicine reminder
 * @access  Private
 */
const deleteReminder = async (req, res) => {
  try {
    const reminder = await MedicineReminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Medicine reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Medicine reminder deleted successfully'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting reminder'
    });
  }
};

module.exports = {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  completeReminder,
  deleteReminder
};
