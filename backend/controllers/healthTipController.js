// ============================================================
// HEALTH TIP CONTROLLER
// Handles CRUD for health tips + daily tip generation
// Demonstrates: Aggregation ($sample), CRUD, Category filtering
// ============================================================

const HealthTip = require('../models/HealthTip');

/**
 * @route   GET /api/tips/daily
 * @desc    Get daily health tips (one random tip per category)
 * @access  Private
 */
const getDailyTips = async (req, res) => {
  try {
    const tips = await HealthTip.getDailyTips();
    res.json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    console.error('Get daily tips error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tips' });
  }
};

/**
 * @route   GET /api/tips
 * @desc    Get all health tips with optional category filter
 * @access  Private
 */
const getAllTips = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const tips = await HealthTip.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tips.length, data: tips });
  } catch (error) {
    console.error('Get all tips error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tips' });
  }
};

/**
 * @route   GET /api/tips/random
 * @desc    Get a single random motivational health tip
 * @access  Private
 */
const getRandomTip = async (req, res) => {
  try {
    const tip = await HealthTip.getRandomTip();
    if (!tip) {
      return res.status(404).json({ success: false, message: 'No tips available' });
    }
    res.json({ success: true, data: tip });
  } catch (error) {
    console.error('Get random tip error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @route   POST /api/tips
 * @desc    Create a new health tip (Admin only)
 * @access  Private/Admin
 */
const createTip = async (req, res) => {
  try {
    const { title, content, category, icon } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }

    const tip = await HealthTip.create({
      title,
      content,
      category,
      icon: icon || '💡',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Health tip created successfully',
      data: tip
    });
  } catch (error) {
    console.error('Create tip error:', error);
    res.status(500).json({ success: false, message: 'Server error creating tip' });
  }
};

/**
 * @route   PUT /api/tips/:id
 * @desc    Update a health tip (Admin only)
 * @access  Private/Admin
 */
const updateTip = async (req, res) => {
  try {
    const { title, content, category, icon, isActive } = req.body;
    const tip = await HealthTip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }

    if (title) tip.title = title;
    if (content) tip.content = content;
    if (category) tip.category = category;
    if (icon) tip.icon = icon;
    if (isActive !== undefined) tip.isActive = isActive;

    await tip.save();
    res.json({ success: true, message: 'Tip updated successfully', data: tip });
  } catch (error) {
    console.error('Update tip error:', error);
    res.status(500).json({ success: false, message: 'Server error updating tip' });
  }
};

/**
 * @route   DELETE /api/tips/:id
 * @desc    Delete a health tip (Admin only)
 * @access  Private/Admin
 */
const deleteTip = async (req, res) => {
  try {
    const tip = await HealthTip.findByIdAndDelete(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }
    res.json({ success: true, message: 'Tip deleted successfully' });
  } catch (error) {
    console.error('Delete tip error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting tip' });
  }
};

module.exports = {
  getDailyTips,
  getAllTips,
  getRandomTip,
  createTip,
  updateTip,
  deleteTip
};
