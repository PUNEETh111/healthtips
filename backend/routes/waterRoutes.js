// ============================================================
// WATER ROUTES - All routes require authentication
// ============================================================

const express = require('express');
const router = express.Router();
const {
  logWater,
  getTodayIntake,
  getWeeklyIntake,
  deleteEntry,
  updateGoal
} = require('../controllers/waterController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', logWater);            // POST /api/water - Log water
router.get('/today', getTodayIntake);   // GET /api/water/today - Today's data
router.get('/weekly', getWeeklyIntake); // GET /api/water/weekly - Weekly trend
router.put('/goal', updateGoal);        // PUT /api/water/goal - Update goal
router.delete('/:id', deleteEntry);     // DELETE /api/water/:id - Delete entry

module.exports = router;
