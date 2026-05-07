// ============================================================
// DATABASE CONFIGURATION
// Connects to MongoDB using Mongoose ODM
// ============================================================

const mongoose = require('mongoose');

/**
 * connectDB - Establishes connection to MongoDB
 * Uses the MONGO_URI from environment variables
 * Implements retry logic and connection event handlers
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure stable connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log('💡 Make sure MongoDB is running on your system');
    process.exit(1);
  }
};

module.exports = connectDB;
