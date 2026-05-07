# 🏥 Smart Health Tips & Reminder System

A modern, full-stack web application for personal wellness management — built as a DBMS Mini Project.

![Tech Stack](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Auth](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)
![CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🎯 Project Objective

A smart healthcare reminder and wellness platform where users can:
- 💊 Set and manage **medicine reminders**
- 💧 Track **daily water intake** with goals
- 🏃 Schedule **exercise reminders**
- 🥗 Browse **categorized health tips**
- 📊 View **health analytics** on a beautiful dashboard
- 🌙 Toggle **dark mode**
- 🔥 Track **activity streaks**

---

## ⚙️ Tech Stack

| Layer        | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React 18 (Vite), Tailwind CSS 3    |
| Backend     | Node.js, Express.js                |
| Database    | MongoDB with Mongoose ODM          |
| Auth        | JWT (JSON Web Tokens)              |
| Charts      | Recharts                           |
| HTTP Client | Axios                              |
| Architecture| MVC Pattern                        |

---

## 📁 Project Structure

```
healthtipsremainder/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile
│   │   ├── medicineController.js # Medicine CRUD
│   │   ├── waterController.js    # Water tracking
│   │   ├── exerciseController.js # Exercise CRUD
│   │   ├── healthTipController.js# Health tips CRUD
│   │   └── dashboardController.js# Analytics aggregation
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── MedicineReminder.js   # Medicine schema
│   │   ├── WaterTracker.js       # Water schema
│   │   ├── HealthTip.js          # Health tip schema
│   │   └── ExerciseReminder.js   # Exercise schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── medicineRoutes.js
│   │   ├── waterRoutes.js
│   │   ├── healthTipRoutes.js
│   │   ├── exerciseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── seed/
│   │   └── seedData.js           # Sample data seeder
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── UI/
│   │   │       └── Modal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Medicine.jsx
│   │   │   ├── Water.jsx
│   │   │   ├── Exercise.jsx
│   │   │   ├── HealthTips.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🗂️ Database Schema (ER Design)

### Collections (MongoDB)

#### 1. USER
| Field          | Type     | Constraints        |
|---------------|----------|---------------------|
| _id           | ObjectId | Primary Key (auto)  |
| name          | String   | NOT NULL, 2-50 chars|
| email         | String   | UNIQUE, NOT NULL    |
| password      | String   | NOT NULL, hashed    |
| role          | String   | ENUM(user, admin)   |
| dailyWaterGoal| Number   | Default: 2000       |
| streak        | Number   | Default: 0          |

#### 2. MEDICINE_REMINDER
| Field         | Type     | Constraints              |
|--------------|----------|---------------------------|
| _id          | ObjectId | Primary Key               |
| userId       | ObjectId | FK → User, NOT NULL       |
| medicineName | String   | NOT NULL                  |
| dosage       | String   | NOT NULL                  |
| time         | String   | NOT NULL                  |
| frequency    | String   | ENUM, NOT NULL            |
| notes        | String   | Optional                  |
| isCompleted  | Boolean  | Default: false            |

#### 3. WATER_TRACKER
| Field     | Type     | Constraints              |
|----------|----------|---------------------------|
| _id      | ObjectId | Primary Key               |
| userId   | ObjectId | FK → User, NOT NULL       |
| amount   | Number   | NOT NULL, 1-5000          |
| timestamp| Date     | Default: now              |

#### 4. HEALTH_TIP
| Field    | Type     | Constraints               |
|---------|----------|----------------------------|
| _id     | ObjectId | Primary Key                |
| title   | String   | NOT NULL                   |
| content | String   | NOT NULL, 10-500 chars     |
| category| String   | ENUM, NOT NULL             |
| icon    | String   | Default: 💡               |

#### 5. EXERCISE_REMINDER
| Field        | Type     | Constraints              |
|-------------|----------|---------------------------|
| _id         | ObjectId | Primary Key               |
| userId      | ObjectId | FK → User, NOT NULL       |
| exerciseName| String   | NOT NULL                  |
| exerciseType| String   | ENUM                      |
| duration    | Number   | 5-300 minutes             |
| reminderTime| String   | NOT NULL                  |
| isCompleted | Boolean  | Default: false            |

### DBMS Features Used
- ✅ Primary Keys (auto-generated `_id`)
- ✅ Foreign Keys (`userId` references)
- ✅ UNIQUE constraints (email)
- ✅ NOT NULL constraints
- ✅ Referential Integrity (Mongoose refs)
- ✅ Aggregation Queries (`$group`, `$sum`, `$match`)
- ✅ Indexing (compound indexes)
- ✅ Transactions (atomic operations)
- ✅ Views/Analytics (dashboard aggregations)
- ✅ Normalized to BCNF

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v16+ — [Download](https://nodejs.org/)
- **MongoDB** — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/healthtipsremainder.git
cd healthtipsremainder
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment
The `.env` file is pre-configured for local MongoDB. Update if needed:
```
MONGO_URI=mongodb://localhost:27017/health_tips_reminder
JWT_SECRET=health_tips_reminder_jwt_secret_2024
PORT=5000
```

### Step 5: Start MongoDB
```bash
# If installed locally:
mongod

# Or use MongoDB Atlas cloud URI in .env
```

### Step 6: Seed the Database
```bash
cd backend
npm run seed
```
This creates sample data with demo login credentials.

### Step 7: Start the Backend
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Step 8: Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🔑 Demo Credentials

| Email               | Password  | Role  |
|--------------------|-----------|-------|
| demo@healthhub.com | demo123   | Admin |
| punith@healthhub.com| punith123| User  |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login user         |
| GET    | /api/auth/profile  | Get profile        |
| PUT    | /api/auth/profile  | Update profile     |

### Medicine Reminders
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| GET    | /api/medicines                | List reminders     |
| POST   | /api/medicines                | Create reminder    |
| PUT    | /api/medicines/:id            | Update reminder    |
| PATCH  | /api/medicines/:id/complete   | Toggle completion  |
| DELETE | /api/medicines/:id            | Delete reminder    |

### Water Tracker
| Method | Endpoint             | Description          |
|--------|---------------------|----------------------|
| POST   | /api/water          | Log water intake     |
| GET    | /api/water/today    | Today's intake       |
| GET    | /api/water/weekly   | Weekly trend data    |
| PUT    | /api/water/goal     | Update daily goal    |

### Health Tips
| Method | Endpoint            | Description         |
|--------|--------------------|--------------------|
| GET    | /api/tips/daily    | Daily random tips   |
| GET    | /api/tips          | All tips            |
| POST   | /api/tips          | Create tip          |
| PUT    | /api/tips/:id      | Update tip          |
| DELETE | /api/tips/:id      | Delete tip          |

### Exercises
| Method | Endpoint                      | Description        |
|--------|-------------------------------|--------------------|
| GET    | /api/exercises                | List exercises     |
| POST   | /api/exercises                | Create exercise    |
| PUT    | /api/exercises/:id            | Update exercise    |
| PATCH  | /api/exercises/:id/complete   | Toggle completion  |
| DELETE | /api/exercises/:id            | Delete exercise    |

### Dashboard
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | /api/dashboard/stats   | Aggregated statistics |
| GET    | /api/dashboard/weekly  | Weekly trends         |
| GET    | /api/dashboard/quote   | Motivational quote    |

---

## ✨ Key Features

- 🔐 **JWT Authentication** — Secure login with encrypted passwords
- 📊 **Analytics Dashboard** — Real-time stats with Recharts
- 💊 **Medicine Reminders** — Full CRUD with completion tracking
- 💧 **Water Tracker** — Circular progress, quick-add, weekly charts
- 🏃 **Exercise Scheduler** — Type-based exercises with calorie tracking
- 🥗 **Health Tips** — Categorized tips with daily rotation
- 🌙 **Dark Mode** — System-aware theme toggle
- 🔥 **Activity Streaks** — Login streak tracking
- 🔍 **Search & Filter** — Find reminders instantly
- 📱 **Responsive Design** — Works on all screen sizes
- 💬 **Motivational Quotes** — Daily wellness inspiration

---

## 🛠️ Built With

- **React 18** — Component-based UI
- **Vite** — Lightning-fast build tool
- **Tailwind CSS 3** — Utility-first styling
- **Express.js** — RESTful API framework
- **Mongoose** — MongoDB object modeling
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **Recharts** — Data visualization
- **React Router v6** — Client-side routing
- **React Hot Toast** — Toast notifications
- **React Icons** — Icon library

---

## 👨‍💻 Author

**Punith Kumar**

---

## 📄 License

This project is built for educational purposes (DBMS Mini Project).
