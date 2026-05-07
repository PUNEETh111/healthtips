// ============================================================
// MEDICINE ROUTES - All routes require authentication
// ============================================================

const express = require('express');
const router = express.Router();
const {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  completeReminder,
  deleteReminder
} = require('../controllers/medicineController');
const { protect } = require('../middleware/auth');

// All routes below require JWT authentication
router.use(protect);

router.route('/')
  .get(getReminders)       // GET /api/medicines - List all reminders
  .post(createReminder);   // POST /api/medicines - Create reminder

router.route('/:id')
  .get(getReminderById)    // GET /api/medicines/:id - Get single
  .put(updateReminder)     // PUT /api/medicines/:id - Update
  .delete(deleteReminder); // DELETE /api/medicines/:id - Delete

// Special route for marking as complete
router.patch('/:id/complete', completeReminder);

module.exports = router;
