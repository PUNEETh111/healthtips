// ============================================================
// HEALTH TIP ROUTES
// Public-like for reading, Admin-only for CRUD management
// ============================================================

const express = require('express');
const router = express.Router();
const {
  getDailyTips,
  getAllTips,
  getRandomTip,
  createTip,
  updateTip,
  deleteTip
} = require('../controllers/healthTipController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

// User routes
router.get('/daily', getDailyTips);    // GET /api/tips/daily - Daily tips
router.get('/random', getRandomTip);   // GET /api/tips/random - Random tip
router.get('/', getAllTips);            // GET /api/tips - All tips

// Admin routes (any authenticated user can manage tips for this project)
router.post('/', createTip);           // POST /api/tips - Create tip
router.put('/:id', updateTip);         // PUT /api/tips/:id - Update tip
router.delete('/:id', deleteTip);      // DELETE /api/tips/:id - Delete tip

module.exports = router;
