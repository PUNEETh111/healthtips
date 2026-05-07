// ============================================================
// SEED DATA SCRIPT
// Populates the database with sample health tips and a demo user
// Run with: npm run seed
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthTip = require('../models/HealthTip');
const MedicineReminder = require('../models/MedicineReminder');
const WaterTracker = require('../models/WaterTracker');
const ExerciseReminder = require('../models/ExerciseReminder');

// ---- SAMPLE HEALTH TIPS DATA ----
const healthTips = [
  // FITNESS TIPS
  {
    category: 'fitness',
    title: 'Start with 10 Minutes',
    content: 'Even a 10-minute walk can boost your mood and energy levels. Start small and build consistency over time.',
    icon: '🏃'
  },
  {
    category: 'fitness',
    title: 'Stretch Every Morning',
    content: 'Morning stretches increase blood flow, improve flexibility, and help prevent injuries throughout the day.',
    icon: '🧘'
  },
  {
    category: 'fitness',
    title: 'Take the Stairs',
    content: 'Choosing stairs over elevators burns calories, strengthens legs, and improves cardiovascular health.',
    icon: '🪜'
  },
  {
    category: 'fitness',
    title: 'Stand Up Every Hour',
    content: 'Sitting for long periods is harmful. Set a timer to stand, stretch, or walk for 2-3 minutes every hour.',
    icon: '🧍'
  },
  {
    category: 'fitness',
    title: 'Find a Workout Buddy',
    content: 'Exercising with a friend increases motivation, accountability, and makes workouts more enjoyable.',
    icon: '👥'
  },

  // NUTRITION TIPS
  {
    category: 'nutrition',
    title: 'Eat the Rainbow',
    content: 'Include fruits and vegetables of different colors in your diet. Each color provides unique vitamins and antioxidants.',
    icon: '🌈'
  },
  {
    category: 'nutrition',
    title: 'Protein at Every Meal',
    content: 'Include a source of protein in every meal to maintain muscle mass, feel fuller longer, and stabilize blood sugar.',
    icon: '🥚'
  },
  {
    category: 'nutrition',
    title: 'Reduce Processed Foods',
    content: 'Limit processed foods high in sodium, sugar, and unhealthy fats. Choose whole foods whenever possible.',
    icon: '🥗'
  },
  {
    category: 'nutrition',
    title: 'Mindful Eating',
    content: 'Eat slowly and without distractions. It takes about 20 minutes for your brain to register that you are full.',
    icon: '🧠'
  },
  {
    category: 'nutrition',
    title: 'Healthy Snacking',
    content: 'Keep healthy snacks like nuts, fruits, and yogurt nearby to avoid reaching for junk food when hungry.',
    icon: '🥜'
  },

  // MENTAL HEALTH TIPS
  {
    category: 'mental_health',
    title: 'Practice Deep Breathing',
    content: 'Take 5 deep breaths when feeling stressed. Inhale for 4 seconds, hold for 4, exhale for 6. This activates your calm response.',
    icon: '🌬️'
  },
  {
    category: 'mental_health',
    title: 'Digital Detox',
    content: 'Spend at least 30 minutes daily away from screens. Read a book, take a walk, or simply sit in nature.',
    icon: '📵'
  },
  {
    category: 'mental_health',
    title: 'Gratitude Journaling',
    content: 'Write down 3 things you are grateful for each day. This simple practice significantly boosts happiness and mental well-being.',
    icon: '📝'
  },
  {
    category: 'mental_health',
    title: 'Connect with Others',
    content: 'Social connections are vital for mental health. Reach out to a friend or family member today.',
    icon: '❤️'
  },
  {
    category: 'mental_health',
    title: 'Set Boundaries',
    content: 'Learn to say no when overwhelmed. Protecting your time and energy is essential for maintaining mental health.',
    icon: '🛡️'
  },

  // SLEEP TIPS
  {
    category: 'sleep',
    title: 'Consistent Sleep Schedule',
    content: 'Go to bed and wake up at the same time every day, even on weekends. This regulates your body clock.',
    icon: '⏰'
  },
  {
    category: 'sleep',
    title: 'No Screens Before Bed',
    content: 'Avoid blue light from phones and laptops at least 1 hour before bedtime. Blue light suppresses melatonin production.',
    icon: '📱'
  },
  {
    category: 'sleep',
    title: 'Cool Bedroom Temperature',
    content: 'Keep your bedroom between 60-67°F (15-19°C) for optimal sleep quality. A cool room promotes deeper sleep.',
    icon: '❄️'
  },
  {
    category: 'sleep',
    title: 'Limit Caffeine After 2 PM',
    content: 'Caffeine can stay in your system for 8+ hours. Avoid coffee, tea, and energy drinks in the afternoon and evening.',
    icon: '☕'
  },
  {
    category: 'sleep',
    title: 'Create a Bedtime Routine',
    content: 'Establish a relaxing routine: warm bath, light reading, gentle stretching. Signal your body that it is time to wind down.',
    icon: '🌙'
  },

  // HYDRATION TIPS
  {
    category: 'hydration',
    title: 'Start Your Day with Water',
    content: 'Drink a glass of water immediately after waking up. It kickstarts your metabolism and rehydrates your body after sleep.',
    icon: '💧'
  },
  {
    category: 'hydration',
    title: 'Carry a Water Bottle',
    content: 'Keep a reusable water bottle with you throughout the day. Visual reminders help you drink more water consistently.',
    icon: '🍶'
  },
  {
    category: 'hydration',
    title: 'Eat Water-Rich Foods',
    content: 'Cucumbers, watermelon, oranges, and strawberries are over 90% water. Eating them contributes to your daily hydration.',
    icon: '🍉'
  },
  {
    category: 'hydration',
    title: 'Set Hydration Reminders',
    content: 'Use this app to set regular water intake reminders. Consistent small sips are better than drinking large amounts at once.',
    icon: '🔔'
  },
  {
    category: 'hydration',
    title: 'Check Your Urine Color',
    content: 'Pale yellow urine indicates good hydration. Dark yellow or amber means you need to drink more water immediately.',
    icon: '🎨'
  }
];

/**
 * seedDatabase - Populates the database with initial data
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await HealthTip.deleteMany({});
    await MedicineReminder.deleteMany({});
    await WaterTracker.deleteMany({});
    await ExerciseReminder.deleteMany({});

    // Create demo user
    console.log('👤 Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@healthhub.com',
      password: 'demo123',
      role: 'admin',
      dailyWaterGoal: 2500,
      streak: 7
    });

    // Create second user
    const testUser = await User.create({
      name: 'Punith Kumar',
      email: 'punith@healthhub.com',
      password: 'punith123',
      role: 'user',
      dailyWaterGoal: 2000,
      streak: 3
    });

    // Insert health tips
    console.log('💡 Inserting health tips...');
    await HealthTip.insertMany(healthTips);

    // Create sample medicine reminders for demo user
    console.log('💊 Creating sample medicine reminders...');
    await MedicineReminder.insertMany([
      {
        userId: demoUser._id,
        medicineName: 'Vitamin D3',
        dosage: '1000 IU',
        time: '08:00',
        frequency: 'daily',
        notes: 'Take with breakfast',
        isCompleted: true,
        completedAt: new Date()
      },
      {
        userId: demoUser._id,
        medicineName: 'Omega-3 Fish Oil',
        dosage: '1 capsule',
        time: '12:00',
        frequency: 'daily',
        notes: 'Take after lunch'
      },
      {
        userId: demoUser._id,
        medicineName: 'Calcium',
        dosage: '500mg',
        time: '20:00',
        frequency: 'daily',
        notes: 'Take after dinner'
      },
      {
        userId: demoUser._id,
        medicineName: 'Multivitamin',
        dosage: '1 tablet',
        time: '09:00',
        frequency: 'daily',
        notes: 'Morning supplement',
        isCompleted: true,
        completedAt: new Date()
      }
    ]);

    // Create sample water entries for demo user (today)
    console.log('💧 Creating sample water entries...');
    const today = new Date();
    const waterEntries = [];
    const amounts = [250, 300, 200, 350, 250, 200];
    const hours = [7, 9, 11, 13, 15, 17];

    for (let i = 0; i < amounts.length; i++) {
      const timestamp = new Date(today);
      timestamp.setHours(hours[i], 0, 0, 0);
      waterEntries.push({
        userId: demoUser._id,
        amount: amounts[i],
        timestamp
      });
    }

    // Add entries for past 6 days
    for (let day = 1; day <= 6; day++) {
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - day);
      const dailyAmounts = [250, 300, 200, 350, 200];
      const dailyHours = [8, 10, 12, 14, 16];

      for (let i = 0; i < dailyAmounts.length; i++) {
        const timestamp = new Date(pastDate);
        timestamp.setHours(dailyHours[i], 0, 0, 0);
        waterEntries.push({
          userId: demoUser._id,
          amount: dailyAmounts[i] + Math.floor(Math.random() * 100),
          timestamp
        });
      }
    }

    await WaterTracker.insertMany(waterEntries);

    // Create sample exercise reminders
    console.log('🏃 Creating sample exercise reminders...');
    await ExerciseReminder.insertMany([
      {
        userId: demoUser._id,
        exerciseName: 'Morning Jog',
        exerciseType: 'cardio',
        duration: 30,
        reminderTime: '06:30',
        frequency: 'daily',
        calories: 250,
        isCompleted: true,
        completedAt: new Date(),
        notes: 'Jog around the park'
      },
      {
        userId: demoUser._id,
        exerciseName: 'Push-ups & Squats',
        exerciseType: 'strength',
        duration: 20,
        reminderTime: '17:00',
        frequency: 'daily',
        calories: 150,
        notes: '3 sets of 15 reps each'
      },
      {
        userId: demoUser._id,
        exerciseName: 'Yoga Session',
        exerciseType: 'flexibility',
        duration: 45,
        reminderTime: '07:00',
        frequency: 'weekdays',
        calories: 180,
        notes: 'Follow YouTube guided session'
      },
      {
        userId: demoUser._id,
        exerciseName: 'Evening Walk',
        exerciseType: 'cardio',
        duration: 20,
        reminderTime: '19:00',
        frequency: 'daily',
        calories: 100,
        isCompleted: true,
        completedAt: new Date(),
        notes: 'Walk after dinner for digestion'
      }
    ]);

    console.log('\n✅ ========================');
    console.log('   DATABASE SEEDED SUCCESSFULLY!');
    console.log('   ========================');
    console.log('\n📧 Demo Login Credentials:');
    console.log('   Email: demo@healthhub.com');
    console.log('   Password: demo123');
    console.log('\n📧 Test User Credentials:');
    console.log('   Email: punith@healthhub.com');
    console.log('   Password: punith123');
    console.log('\n📊 Data Summary:');
    console.log(`   • ${healthTips.length} Health Tips`);
    console.log('   • 4 Medicine Reminders');
    console.log(`   • ${waterEntries.length} Water Entries`);
    console.log('   • 4 Exercise Reminders');
    console.log('   • 2 Users\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
