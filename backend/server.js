// ============================================================
// EXPRESS SERVER - Entry Point
// Smart Health Tips & Reminder System Backend
// Serves API + Frontend (production)
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Import route modules
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const waterRoutes = require('./routes/waterRoutes');
const healthTipRoutes = require('./routes/healthTipRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize Express app
const app = express();

// ---- MIDDLEWARE ----

// Enable CORS for frontend communication
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL  // Allow production frontend URL
  ].filter(Boolean),
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---- API ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/tips', healthTipRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---- HEALTH CHECK ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- SERVE FRONTEND IN PRODUCTION ----
// In production, Express serves the built React frontend
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // For any route that doesn't match an API endpoint,
  // serve the React index.html (supports client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Development root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: '🏥 Smart Health Tips & Reminder System API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        medicines: '/api/medicines',
        water: '/api/water',
        tips: '/api/tips',
        exercises: '/api/exercises',
        dashboard: '/api/dashboard'
      }
    });
  });
}

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
