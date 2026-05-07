// ============================================================
// EXERCISE ROUTES - All routes require authentication
// ============================================================

const express = require('express');
const router = express.Router();
const {
  createExercise,
  getExercises,
  updateExercise,
  completeExercise,
  deleteExercise
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getExercises)       // GET /api/exercises
  .post(createExercise);   // POST /api/exercises

router.route('/:id')
  .put(updateExercise)     // PUT /api/exercises/:id
  .delete(deleteExercise); // DELETE /api/exercises/:id

router.patch('/:id/complete', completeExercise);

module.exports = router;
