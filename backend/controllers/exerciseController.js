// ============================================================
// EXERCISE CONTROLLER
// Handles CRUD operations for exercise reminders
// Demonstrates: CRUD, Filtering, Completion tracking
// ============================================================

const ExerciseReminder = require('../models/ExerciseReminder');

/**
 * @route   POST /api/exercises
 * @desc    Create a new exercise reminder
 * @access  Private
 */
const createExercise = async (req, res) => {
  try {
    const { exerciseName, exerciseType, duration, reminderTime, frequency, calories, notes } = req.body;

    if (!exerciseName || !reminderTime) {
      return res.status(400).json({
        success: false,
        message: 'Exercise name and reminder time are required'
      });
    }

    const exercise = await ExerciseReminder.create({
      userId: req.user._id,
      exerciseName,
      exerciseType: exerciseType || 'cardio',
      duration: duration || 30,
      reminderTime,
      frequency: frequency || 'daily',
      calories: calories || 0,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Exercise reminder created successfully',
      data: exercise
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ success: false, message: 'Server error creating exercise' });
  }
};

/**
 * @route   GET /api/exercises
 * @desc    Get all exercise reminders for the user
 * @access  Private
 */
const getExercises = async (req, res) => {
  try {
    const { search, type, completed } = req.query;
    const filter = { userId: req.user._id };

    if (search) {
      filter.exerciseName = { $regex: search, $options: 'i' };
    }
    if (type && type !== 'all') {
      filter.exerciseType = type;
    }
    if (completed === 'true') filter.isCompleted = true;
    if (completed === 'false') filter.isCompleted = false;

    const exercises = await ExerciseReminder.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching exercises' });
  }
};

/**
 * @route   PUT /api/exercises/:id
 * @desc    Update an exercise reminder
 * @access  Private
 */
const updateExercise = async (req, res) => {
  try {
    const { exerciseName, exerciseType, duration, reminderTime, frequency, calories, notes, isActive } = req.body;

    const exercise = await ExerciseReminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    if (exerciseName) exercise.exerciseName = exerciseName;
    if (exerciseType) exercise.exerciseType = exerciseType;
    if (duration) exercise.duration = duration;
    if (reminderTime) exercise.reminderTime = reminderTime;
    if (frequency) exercise.frequency = frequency;
    if (calories !== undefined) exercise.calories = calories;
    if (notes !== undefined) exercise.notes = notes;
    if (isActive !== undefined) exercise.isActive = isActive;

    await exercise.save();

    res.json({
      success: true,
      message: 'Exercise updated successfully',
      data: exercise
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ success: false, message: 'Server error updating exercise' });
  }
};

/**
 * @route   PATCH /api/exercises/:id/complete
 * @desc    Toggle exercise completion status
 * @access  Private
 */
const completeExercise = async (req, res) => {
  try {
    const exercise = await ExerciseReminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    exercise.isCompleted = !exercise.isCompleted;
    exercise.completedAt = exercise.isCompleted ? new Date() : null;
    await exercise.save();

    res.json({
      success: true,
      message: exercise.isCompleted ? 'Exercise completed! 🎉' : 'Exercise marked incomplete',
      data: exercise
    });
  } catch (error) {
    console.error('Complete exercise error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @route   DELETE /api/exercises/:id
 * @desc    Delete an exercise reminder
 * @access  Private
 */
const deleteExercise = async (req, res) => {
  try {
    const exercise = await ExerciseReminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.json({ success: true, message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting exercise' });
  }
};

module.exports = {
  createExercise,
  getExercises,
  updateExercise,
  completeExercise,
  deleteExercise
};
