// ============================================================
// DASHBOARD ROUTES - Analytics and summary data
// ============================================================

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getWeeklySummary,
  getMotivationalQuote
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getDashboardStats);     // GET /api/dashboard/stats
router.get('/weekly', getWeeklySummary);      // GET /api/dashboard/weekly
router.get('/quote', getMotivationalQuote);   // GET /api/dashboard/quote

module.exports = router;
