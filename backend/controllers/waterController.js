// ============================================================
// WATER CONTROLLER
// Handles water intake tracking with aggregation analytics
// Demonstrates: Aggregation, GROUP BY, Date-based queries
// ============================================================

const WaterTracker = require('../models/WaterTracker');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @route   POST /api/water
 * @desc    Log a water intake entry
 * @access  Private
 */
const logWater = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid water amount (in ml)'
      });
    }

    const entry = await WaterTracker.create({
      userId: req.user._id,
      amount,
      timestamp: new Date()
    });

    // Get updated daily total
    const dailyTotal = await WaterTracker.getDailyTotal(req.user._id, new Date());
    const user = await User.findById(req.user._id);
    const percentage = Math.min(
      Math.round((dailyTotal.totalAmount / user.dailyWaterGoal) * 100),
      100
    );

    res.status(201).json({
      success: true,
      message: `💧 ${amount}ml logged! Daily total: ${dailyTotal.totalAmount}ml (${percentage}%)`,
      data: {
        entry,
        dailyTotal: dailyTotal.totalAmount,
        goal: user.dailyWaterGoal,
        percentage
      }
    });
  } catch (error) {
    console.error('Log water error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error logging water intake'
    });
  }
};

/**
 * @route   GET /api/water/today
 * @desc    Get today's water intake summary
 * @access  Private
 */
const getTodayIntake = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all entries for today
    const entries = await WaterTracker.find({
      userId: req.user._id,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 });

    // Get daily total using aggregation
    const dailyTotal = await WaterTracker.getDailyTotal(req.user._id, today);
    const user = await User.findById(req.user._id);
    const percentage = Math.min(
      Math.round((dailyTotal.totalAmount / user.dailyWaterGoal) * 100),
      100
    );

    res.json({
      success: true,
      data: {
        entries,
        totalAmount: dailyTotal.totalAmount,
        goal: user.dailyWaterGoal,
        percentage,
        entryCount: dailyTotal.entryCount
      }
    });
  } catch (error) {
    console.error('Get today intake error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching water intake'
    });
  }
};

/**
 * @route   GET /api/water/weekly
 * @desc    Get weekly water intake data for charts
 * @access  Private
 * Demonstrates: Aggregation pipeline with date grouping
 */
const getWeeklyIntake = async (req, res) => {
  try {
    const weeklyData = await WaterTracker.getWeeklyData(req.user._id);
    const user = await User.findById(req.user._id);

    // Fill in missing days with 0 values
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = weeklyData.find(d => d._id === dateStr);

      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        totalAmount: dayData ? dayData.totalAmount : 0,
        goal: user.dailyWaterGoal,
        percentage: dayData
          ? Math.min(Math.round((dayData.totalAmount / user.dailyWaterGoal) * 100), 100)
          : 0
      });
    }

    res.json({
      success: true,
      data: last7Days
    });
  } catch (error) {
    console.error('Get weekly intake error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching weekly data'
    });
  }
};

/**
 * @route   DELETE /api/water/:id
 * @desc    Delete a water intake entry
 * @access  Private
 */
const deleteEntry = async (req, res) => {
  try {
    const entry = await WaterTracker.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Water entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Water entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete water entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting entry'
    });
  }
};

/**
 * @route   PUT /api/water/goal
 * @desc    Update daily water goal
 * @access  Private
 */
const updateGoal = async (req, res) => {
  try {
    const { dailyWaterGoal } = req.body;

    if (!dailyWaterGoal || dailyWaterGoal < 500 || dailyWaterGoal > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Daily water goal must be between 500ml and 10000ml'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { dailyWaterGoal },
      { new: true }
    );

    res.json({
      success: true,
      message: `Daily water goal updated to ${dailyWaterGoal}ml`,
      data: { dailyWaterGoal: user.dailyWaterGoal }
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating goal'
    });
  }
};

module.exports = {
  logWater,
  getTodayIntake,
  getWeeklyIntake,
  deleteEntry,
  updateGoal
};
