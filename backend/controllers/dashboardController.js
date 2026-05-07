// ============================================================
// DASHBOARD CONTROLLER
// Aggregates data across all modules for analytics dashboard
// Demonstrates: Complex Aggregation, JOINs ($lookup), Views
// ============================================================

const MedicineReminder = require('../models/MedicineReminder');
const WaterTracker = require('../models/WaterTracker');
const ExerciseReminder = require('../models/ExerciseReminder');
const HealthTip = require('../models/HealthTip');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get aggregated dashboard statistics for the logged-in user
 * @access  Private
 * 
 * This demonstrates complex aggregation queries equivalent to:
 *   SELECT COUNT(*), SUM(), AVG() FROM multiple tables
 *   WITH JOIN and GROUP BY operations
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // ---- PARALLEL AGGREGATION QUERIES ----
    // Execute multiple queries simultaneously for performance

    const [
      totalMedicines,
      completedMedicines,
      todayMedicines,
      waterToday,
      totalExercises,
      completedExercises,
      user
    ] = await Promise.all([
      // COUNT total active medicine reminders
      MedicineReminder.countDocuments({ userId, isActive: true }),

      // COUNT completed medicines today
      MedicineReminder.countDocuments({
        userId,
        isCompleted: true,
        completedAt: { $gte: startOfDay, $lte: endOfDay }
      }),

      // COUNT today's medicine reminders
      MedicineReminder.countDocuments({
        userId,
        isActive: true,
        createdAt: { $gte: startOfDay }
      }),

      // SUM water intake today (Aggregation)
      WaterTracker.getDailyTotal(userId, today),

      // COUNT total active exercises
      ExerciseReminder.countDocuments({ userId, isActive: true }),

      // COUNT completed exercises today
      ExerciseReminder.countDocuments({
        userId,
        isCompleted: true,
        completedAt: { $gte: startOfDay, $lte: endOfDay }
      }),

      // Get user data for water goal
      User.findById(userId)
    ]);

    // Calculate health score (0-100)
    const waterPercentage = user.dailyWaterGoal > 0
      ? Math.min((waterToday.totalAmount / user.dailyWaterGoal) * 100, 100)
      : 0;
    const medicineRate = totalMedicines > 0
      ? (completedMedicines / totalMedicines) * 100
      : 100;
    const exerciseRate = totalExercises > 0
      ? (completedExercises / totalExercises) * 100
      : 100;

    const healthScore = Math.round(
      (waterPercentage * 0.3) + (medicineRate * 0.4) + (exerciseRate * 0.3)
    );

    res.json({
      success: true,
      data: {
        totalMedicines,
        completedMedicines,
        medicineCompletionRate: totalMedicines > 0
          ? Math.round((completedMedicines / totalMedicines) * 100)
          : 0,
        waterIntakeToday: waterToday.totalAmount,
        waterGoal: user.dailyWaterGoal,
        waterPercentage: Math.round(waterPercentage),
        totalExercises,
        completedExercises,
        exerciseCompletionRate: totalExercises > 0
          ? Math.round((completedExercises / totalExercises) * 100)
          : 0,
        healthScore,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard' });
  }
};

/**
 * @route   GET /api/dashboard/weekly
 * @desc    Get weekly wellness summary with trends
 * @access  Private
 * 
 * Demonstrates: Multi-collection aggregation with date grouping
 */
const getWeeklySummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Water intake trend (last 7 days)
    const waterTrend = await WaterTracker.getWeeklyData(req.user._id);

    // Medicine completion trend (last 7 days)
    const medicineTrend = await MedicineReminder.aggregate([
      {
        $match: {
          userId,
          updatedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Exercise completion trend (last 7 days)
    const exerciseTrend = await ExerciseReminder.aggregate([
      {
        $match: {
          userId,
          updatedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Build complete 7-day data
    const user = await User.findById(req.user._id);
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const water = waterTrend.find(w => w._id === dateStr);
      const medicine = medicineTrend.find(m => m._id === dateStr);
      const exercise = exerciseTrend.find(e => e._id === dateStr);

      weeklyData.push({
        date: dateStr,
        day: dayName,
        water: water ? water.totalAmount : 0,
        waterGoal: user.dailyWaterGoal,
        medicineTotal: medicine ? medicine.total : 0,
        medicineCompleted: medicine ? medicine.completed : 0,
        exerciseTotal: exercise ? exercise.total : 0,
        exerciseCompleted: exercise ? exercise.completed : 0
      });
    }

    res.json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    console.error('Weekly summary error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching weekly data' });
  }
};

/**
 * @route   GET /api/dashboard/quote
 * @desc    Get a random motivational wellness quote
 * @access  Private
 */
const getMotivationalQuote = async (req, res) => {
  const quotes = [
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "Health is not valued till sickness comes.", author: "Thomas Fuller" },
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "An apple a day keeps the doctor away.", author: "Proverb" },
    { text: "Happiness is the highest form of health.", author: "Dalai Lama" },
    { text: "Your body hears everything your mind says.", author: "Naomi Judd" },
    { text: "Health is a state of complete harmony of the body, mind, and spirit.", author: "B.K.S. Iyengar" },
    { text: "To keep the body in good health is a duty.", author: "Buddha" },
    { text: "Wellness is the complete integration of body, mind, and spirit.", author: "Greg Anderson" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "Movement is medicine for changing a person's physical, emotional, and mental state.", author: "Carol Welch" },
    { text: "Sleep is the best meditation.", author: "Dalai Lama" },
    { text: "Water is the driving force of all nature.", author: "Leonardo da Vinci" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Investing in your health will produce enormous returns.", author: "Tom Rath" }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ success: true, data: randomQuote });
};

module.exports = {
  getDashboardStats,
  getWeeklySummary,
  getMotivationalQuote
};
