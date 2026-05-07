// ============================================================
// MOCK DATA SERVICE
// Provides sample data when backend is unavailable
// Enables the frontend to run as a standalone demo
// ============================================================

// ---- MOCK USER ----
const mockUser = {
  _id: 'demo-user-001',
  name: 'Demo User',
  email: 'demo@healthhub.com',
  role: 'admin',
  dailyWaterGoal: 2500,
  streak: 7,
  createdAt: '2025-01-15T10:00:00Z',
  token: 'mock-jwt-token-for-demo'
};

// ---- MOCK MEDICINES ----
let mockMedicines = [
  { _id: 'm1', userId: 'demo-user-001', medicineName: 'Vitamin D3', dosage: '1000 IU', time: '08:00', frequency: 'daily', notes: 'Take with breakfast', isCompleted: true, completedAt: new Date().toISOString(), isActive: true, createdAt: new Date().toISOString() },
  { _id: 'm2', userId: 'demo-user-001', medicineName: 'Omega-3 Fish Oil', dosage: '1 capsule', time: '12:00', frequency: 'daily', notes: 'Take after lunch', isCompleted: false, completedAt: null, isActive: true, createdAt: new Date().toISOString() },
  { _id: 'm3', userId: 'demo-user-001', medicineName: 'Calcium', dosage: '500mg', time: '20:00', frequency: 'daily', notes: 'Take after dinner', isCompleted: false, completedAt: null, isActive: true, createdAt: new Date().toISOString() },
  { _id: 'm4', userId: 'demo-user-001', medicineName: 'Multivitamin', dosage: '1 tablet', time: '09:00', frequency: 'daily', notes: 'Morning supplement', isCompleted: true, completedAt: new Date().toISOString(), isActive: true, createdAt: new Date().toISOString() },
];

// ---- MOCK EXERCISES ----
let mockExercises = [
  { _id: 'e1', userId: 'demo-user-001', exerciseName: 'Morning Jog', exerciseType: 'cardio', duration: 30, reminderTime: '06:30', frequency: 'daily', calories: 250, isCompleted: true, completedAt: new Date().toISOString(), isActive: true, notes: 'Jog around the park', createdAt: new Date().toISOString() },
  { _id: 'e2', userId: 'demo-user-001', exerciseName: 'Push-ups & Squats', exerciseType: 'strength', duration: 20, reminderTime: '17:00', frequency: 'daily', calories: 150, isCompleted: false, completedAt: null, isActive: true, notes: '3 sets of 15 reps each', createdAt: new Date().toISOString() },
  { _id: 'e3', userId: 'demo-user-001', exerciseName: 'Yoga Session', exerciseType: 'flexibility', duration: 45, reminderTime: '07:00', frequency: 'weekdays', calories: 180, isCompleted: false, completedAt: null, isActive: true, notes: 'Follow guided session', createdAt: new Date().toISOString() },
  { _id: 'e4', userId: 'demo-user-001', exerciseName: 'Evening Walk', exerciseType: 'cardio', duration: 20, reminderTime: '19:00', frequency: 'daily', calories: 100, isCompleted: true, completedAt: new Date().toISOString(), isActive: true, notes: 'Walk after dinner', createdAt: new Date().toISOString() },
];

// ---- MOCK WATER DATA ----
const generateWaterEntries = () => {
  const entries = [];
  const today = new Date();
  const amounts = [250, 300, 200, 350, 250, 200];
  const hours = [7, 9, 11, 13, 15, 17];
  for (let i = 0; i < amounts.length; i++) {
    const ts = new Date(today); ts.setHours(hours[i], 0, 0, 0);
    entries.push({ _id: `w${i}`, userId: 'demo-user-001', amount: amounts[i], timestamp: ts.toISOString() });
  }
  return entries;
};
let mockWaterEntries = generateWaterEntries();

const getWeeklyWater = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      totalAmount: 1200 + Math.floor(Math.random() * 1200),
      goal: 2500,
    });
  }
  days[days.length - 1].totalAmount = mockWaterEntries.reduce((s, e) => s + e.amount, 0);
  return days;
};

// ---- MOCK HEALTH TIPS ----
const mockTips = [
  { _id: 't1', category: 'fitness', title: 'Start with 10 Minutes', content: 'Even a 10-minute walk can boost your mood and energy levels. Start small and build consistency over time.', icon: '🏃', isActive: true },
  { _id: 't2', category: 'nutrition', title: 'Eat the Rainbow', content: 'Include fruits and vegetables of different colors in your diet. Each color provides unique vitamins and antioxidants.', icon: '🌈', isActive: true },
  { _id: 't3', category: 'mental_health', title: 'Practice Deep Breathing', content: 'Take 5 deep breaths when feeling stressed. Inhale for 4 seconds, hold for 4, exhale for 6.', icon: '🌬️', isActive: true },
  { _id: 't4', category: 'sleep', title: 'Consistent Sleep Schedule', content: 'Go to bed and wake up at the same time every day, even on weekends. This regulates your body clock.', icon: '⏰', isActive: true },
  { _id: 't5', category: 'hydration', title: 'Start Your Day with Water', content: 'Drink a glass of water immediately after waking up. It kickstarts your metabolism and rehydrates your body.', icon: '💧', isActive: true },
  { _id: 't6', category: 'fitness', title: 'Stretch Every Morning', content: 'Morning stretches increase blood flow, improve flexibility, and help prevent injuries throughout the day.', icon: '🧘', isActive: true },
  { _id: 't7', category: 'nutrition', title: 'Protein at Every Meal', content: 'Include a source of protein in every meal to maintain muscle mass, feel fuller longer, and stabilize blood sugar.', icon: '🥚', isActive: true },
  { _id: 't8', category: 'mental_health', title: 'Gratitude Journaling', content: 'Write down 3 things you are grateful for each day. This simple practice significantly boosts happiness.', icon: '📝', isActive: true },
  { _id: 't9', category: 'sleep', title: 'No Screens Before Bed', content: 'Avoid blue light from phones and laptops at least 1 hour before bedtime. Blue light suppresses melatonin.', icon: '📱', isActive: true },
  { _id: 't10', category: 'hydration', title: 'Carry a Water Bottle', content: 'Keep a reusable water bottle with you throughout the day. Visual reminders help you drink more water.', icon: '🍶', isActive: true },
  { _id: 't11', category: 'fitness', title: 'Take the Stairs', content: 'Choosing stairs over elevators burns calories, strengthens legs, and improves cardiovascular health.', icon: '🪜', isActive: true },
  { _id: 't12', category: 'nutrition', title: 'Mindful Eating', content: 'Eat slowly and without distractions. It takes about 20 minutes for your brain to register fullness.', icon: '🧠', isActive: true },
  { _id: 't13', category: 'mental_health', title: 'Digital Detox', content: 'Spend at least 30 minutes daily away from screens. Read a book, take a walk, or sit in nature.', icon: '📵', isActive: true },
  { _id: 't14', category: 'sleep', title: 'Cool Bedroom Temperature', content: 'Keep your bedroom between 60-67°F (15-19°C) for optimal sleep quality.', icon: '❄️', isActive: true },
  { _id: 't15', category: 'hydration', title: 'Eat Water-Rich Foods', content: 'Cucumbers, watermelon, oranges, and strawberries are over 90% water and contribute to hydration.', icon: '🍉', isActive: true },
];

// ---- MOCK QUOTES ----
const quotes = [
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "The greatest wealth is health.", author: "Virgil" },
  { text: "Happiness is the highest form of health.", author: "Dalai Lama" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "Investing in your health will produce enormous returns.", author: "Tom Rath" },
  { text: "Sleep is the best meditation.", author: "Dalai Lama" },
  { text: "Water is the driving force of all nature.", author: "Leonardo da Vinci" },
];

// ---- HELPER: Generate unique IDs ----
let idCounter = 100;
const genId = () => `mock-${++idCounter}`;

// ---- DELAY TO SIMULATE NETWORK ----
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ============================================================
// MOCK API HANDLERS — same shape as real API responses
// ============================================================
export const mockAPI = {
  // AUTH
  auth: {
    login: async () => { await delay(); return { data: { success: true, message: 'Welcome back!', data: { ...mockUser } } }; },
    register: async ({ name, email }) => { await delay(); return { data: { success: true, message: 'Registration successful!', data: { ...mockUser, name, email } } }; },
    getProfile: async () => { await delay(); return { data: { success: true, data: { ...mockUser } } }; },
    updateProfile: async (d) => { await delay(); Object.assign(mockUser, d); return { data: { success: true, message: 'Profile updated', data: { ...mockUser } } }; },
  },

  // MEDICINES
  medicines: {
    getAll: async (params) => {
      await delay();
      let list = [...mockMedicines];
      if (params?.search) list = list.filter(m => m.medicineName.toLowerCase().includes(params.search.toLowerCase()));
      if (params?.frequency && params.frequency !== 'all') list = list.filter(m => m.frequency === params.frequency);
      return { data: { success: true, count: list.length, data: list } };
    },
    create: async (d) => { await delay(); const m = { _id: genId(), ...d, isCompleted: false, completedAt: null, isActive: true, createdAt: new Date().toISOString() }; mockMedicines.unshift(m); return { data: { success: true, message: 'Reminder created', data: m } }; },
    update: async (id, d) => { await delay(); const i = mockMedicines.findIndex(m => m._id === id); if (i >= 0) Object.assign(mockMedicines[i], d); return { data: { success: true, message: 'Updated', data: mockMedicines[i] } }; },
    complete: async (id) => { await delay(); const m = mockMedicines.find(x => x._id === id); if (m) { m.isCompleted = !m.isCompleted; m.completedAt = m.isCompleted ? new Date().toISOString() : null; } return { data: { success: true, message: m?.isCompleted ? 'Medicine marked as taken ✅' : 'Marked as not taken', data: m } }; },
    delete: async (id) => { await delay(); mockMedicines = mockMedicines.filter(m => m._id !== id); return { data: { success: true, message: 'Deleted' } }; },
  },

  // WATER
  water: {
    log: async ({ amount }) => {
      await delay();
      const entry = { _id: genId(), userId: 'demo-user-001', amount, timestamp: new Date().toISOString() };
      mockWaterEntries.unshift(entry);
      const total = mockWaterEntries.reduce((s, e) => s + e.amount, 0);
      const pct = Math.min(Math.round((total / mockUser.dailyWaterGoal) * 100), 100);
      return { data: { success: true, message: `💧 ${amount}ml logged! Daily total: ${total}ml (${pct}%)`, data: { entry, dailyTotal: total, goal: mockUser.dailyWaterGoal, percentage: pct } } };
    },
    getToday: async () => {
      await delay();
      const total = mockWaterEntries.reduce((s, e) => s + e.amount, 0);
      const pct = Math.min(Math.round((total / mockUser.dailyWaterGoal) * 100), 100);
      return { data: { success: true, data: { entries: mockWaterEntries, totalAmount: total, goal: mockUser.dailyWaterGoal, percentage: pct, entryCount: mockWaterEntries.length } } };
    },
    getWeekly: async () => { await delay(); return { data: { success: true, data: getWeeklyWater() } }; },
    updateGoal: async ({ dailyWaterGoal }) => { await delay(); mockUser.dailyWaterGoal = dailyWaterGoal; return { data: { success: true, message: `Goal updated to ${dailyWaterGoal}ml`, data: { dailyWaterGoal } } }; },
    delete: async (id) => { await delay(); mockWaterEntries = mockWaterEntries.filter(e => e._id !== id); return { data: { success: true, message: 'Deleted' } }; },
  },

  // TIPS
  tips: {
    getDaily: async () => { await delay(); const cats = ['fitness','nutrition','mental_health','sleep','hydration']; const daily = cats.map(c => mockTips.filter(t => t.category === c)[Math.floor(Math.random() * 3)] || mockTips.find(t => t.category === c)).filter(Boolean); return { data: { success: true, count: daily.length, data: daily } }; },
    getAll: async (params) => { await delay(); let list = [...mockTips]; if (params?.category && params.category !== 'all') list = list.filter(t => t.category === params.category); if (params?.search) list = list.filter(t => t.title.toLowerCase().includes(params.search.toLowerCase()) || t.content.toLowerCase().includes(params.search.toLowerCase())); return { data: { success: true, count: list.length, data: list } }; },
    getRandom: async () => { await delay(); return { data: { success: true, data: mockTips[Math.floor(Math.random() * mockTips.length)] } }; },
    create: async (d) => { await delay(); const t = { _id: genId(), ...d, isActive: true }; mockTips.push(t); return { data: { success: true, message: 'Tip created', data: t } }; },
    update: async (id, d) => { await delay(); const i = mockTips.findIndex(t => t._id === id); if (i >= 0) Object.assign(mockTips[i], d); return { data: { success: true, message: 'Updated', data: mockTips[i] } }; },
    delete: async (id) => { await delay(); const i = mockTips.findIndex(t => t._id === id); if (i >= 0) mockTips.splice(i, 1); return { data: { success: true, message: 'Deleted' } }; },
  },

  // EXERCISES
  exercises: {
    getAll: async (params) => {
      await delay();
      let list = [...mockExercises];
      if (params?.search) list = list.filter(e => e.exerciseName.toLowerCase().includes(params.search.toLowerCase()));
      if (params?.type && params.type !== 'all') list = list.filter(e => e.exerciseType === params.type);
      return { data: { success: true, count: list.length, data: list } };
    },
    create: async (d) => { await delay(); const e = { _id: genId(), ...d, isCompleted: false, completedAt: null, isActive: true, createdAt: new Date().toISOString() }; mockExercises.unshift(e); return { data: { success: true, message: 'Exercise added', data: e } }; },
    update: async (id, d) => { await delay(); const i = mockExercises.findIndex(e => e._id === id); if (i >= 0) Object.assign(mockExercises[i], d); return { data: { success: true, message: 'Updated', data: mockExercises[i] } }; },
    complete: async (id) => { await delay(); const e = mockExercises.find(x => x._id === id); if (e) { e.isCompleted = !e.isCompleted; e.completedAt = e.isCompleted ? new Date().toISOString() : null; } return { data: { success: true, message: e?.isCompleted ? 'Exercise completed! 🎉' : 'Marked incomplete', data: e } }; },
    delete: async (id) => { await delay(); mockExercises = mockExercises.filter(e => e._id !== id); return { data: { success: true, message: 'Deleted' } }; },
  },

  // DASHBOARD
  dashboard: {
    getStats: async () => {
      await delay();
      const totalMed = mockMedicines.length;
      const compMed = mockMedicines.filter(m => m.isCompleted).length;
      const totalEx = mockExercises.length;
      const compEx = mockExercises.filter(e => e.isCompleted).length;
      const waterTotal = mockWaterEntries.reduce((s, e) => s + e.amount, 0);
      const waterPct = Math.min(Math.round((waterTotal / mockUser.dailyWaterGoal) * 100), 100);
      const medRate = totalMed > 0 ? Math.round((compMed / totalMed) * 100) : 100;
      const exRate = totalEx > 0 ? Math.round((compEx / totalEx) * 100) : 100;
      const healthScore = Math.round(waterPct * 0.3 + medRate * 0.4 + exRate * 0.3);
      return { data: { success: true, data: { totalMedicines: totalMed, completedMedicines: compMed, medicineCompletionRate: medRate, waterIntakeToday: waterTotal, waterGoal: mockUser.dailyWaterGoal, waterPercentage: waterPct, totalExercises: totalEx, completedExercises: compEx, exerciseCompletionRate: exRate, healthScore, streak: mockUser.streak } } };
    },
    getWeekly: async () => {
      await delay();
      const data = getWeeklyWater().map(d => ({ ...d, waterGoal: mockUser.dailyWaterGoal, medicineTotal: 4, medicineCompleted: Math.floor(Math.random() * 4) + 1, exerciseTotal: 4, exerciseCompleted: Math.floor(Math.random() * 3) + 1 }));
      return { data: { success: true, data } };
    },
    getQuote: async () => { await delay(100); return { data: { success: true, data: quotes[Math.floor(Math.random() * quotes.length)] } }; },
  },
};

export default mockAPI;
