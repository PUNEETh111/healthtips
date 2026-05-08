# Software Requirements Specification (SRS)

# 🏥 Smart Health Tips & Reminder System

**Version:** 1.0  
**Date:** May 2026  
**Author:** Punith Kumar  
**Project Type:** DBMS Mini Project  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the **Smart Health Tips & Reminder System** — a full-stack web application that helps users manage their daily health activities including medicine reminders, water intake tracking, exercise scheduling, and health tip browsing.

### 1.2 Scope
The system provides:
- User registration and authentication (JWT-based)
- Medicine reminder management with completion tracking
- Daily water intake monitoring with goal setting
- Exercise reminder scheduling with calorie tracking
- Categorized health tips with daily rotation
- Analytics dashboard with visual charts
- Dark mode support and responsive design

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|-----------|
| SRS | Software Requirements Specification |
| JWT | JSON Web Token |
| CRUD | Create, Read, Update, Delete |
| API | Application Programming Interface |
| BCNF | Boyce-Codd Normal Form |
| MVC | Model-View-Controller |
| ODM | Object Document Mapper |
| SPA | Single Page Application |

### 1.4 References
- IEEE 830-1998 SRS Standard
- MongoDB Documentation (v8.x)
- Express.js Documentation (v4.x)
- React Documentation (v18.x)

---

## 2. Overall Description

### 2.1 Product Perspective
This is a standalone web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It follows the MVC architectural pattern with a REST API backend and SPA frontend.

### 2.2 Product Functions (High-Level)

```
┌─────────────────────────────────────────────┐
│        Smart Health Tips & Reminder         │
├──────────┬──────────┬──────────┬────────────┤
│  Auth    │ Medicine │  Water   │  Exercise  │
│  Module  │  Module  │  Module  │  Module    │
├──────────┴──────────┴──────────┴────────────┤
│           Health Tips Module                │
├─────────────────────────────────────────────┤
│         Dashboard & Analytics               │
└─────────────────────────────────────────────┘
```

### 2.3 User Classes

| User Type | Description | Permissions |
|-----------|-------------|-------------|
| **Guest** | Unauthenticated visitor | Access login/register only |
| **User** | Registered member | Full CRUD on own data, view tips |
| **Admin** | System administrator | All user permissions + manage health tips |

### 2.4 Operating Environment
- **Client:** Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Server:** Node.js v16+ runtime
- **Database:** MongoDB v6+
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

### 2.5 Design Constraints
- Must use MongoDB as the database (DBMS project requirement)
- Must demonstrate normalization up to BCNF
- Must implement aggregation queries
- Frontend must be responsive (mobile + desktop)

### 2.6 Assumptions
- Users have internet access
- MongoDB server is accessible
- Users have a modern browser with JavaScript enabled

---

## 3. System Architecture

### 3.1 Architecture Diagram

```
┌───────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                   │
│  ┌─────────────────────────────────────────────────┐  │
│  │  React 18 + Vite + Tailwind CSS + Recharts      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │  │
│  │  │  Pages   │ │Components│ │ Context (Auth,   │ │  │
│  │  │          │ │          │ │ Theme)           │ │  │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐│  │
│  │  │          Axios HTTP Client + JWT             ││  │
│  │  └──────────────────────────────────────────────┘│  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────┘
                        │ REST API (JSON)
┌───────────────────────┴───────────────────────────────┐
│                   SERVER (Node.js)                    │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Express.js + CORS + Morgan          │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  Middleware: JWT Auth, Validation, Error Handler  │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  Routes → Controllers → Models (MVC Pattern)    │ │
│  │  ┌────────┐ ┌──────────────┐ ┌────────────────┐ │ │
│  │  │ Routes │→│ Controllers  │→│ Mongoose Models│ │ │
│  │  └────────┘ └──────────────┘ └────────────────┘ │ │
│  └──────────────────────┬───────────────────────────┘ │
└─────────────────────────┼─────────────────────────────┘
                          │ Mongoose ODM
┌─────────────────────────┴─────────────────────────────┐
│                  DATABASE (MongoDB)                   │
│  ┌──────┐ ┌──────────────┐ ┌────────────────────────┐ │
│  │Users │ │MedicineRemind│ │WaterTrackers           │ │
│  └──────┘ └──────────────┘ └────────────────────────┘ │
│  ┌──────────────┐ ┌──────────────────────────────────┐│
│  │ExerciseRemind│ │HealthTips                        ││
│  └──────────────┘ └──────────────────────────────────┘│
└───────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React (Vite) | 18.x |
| Styling | Tailwind CSS | 3.x |
| Charts | Recharts | 2.x |
| HTTP | Axios | 1.x |
| Routing | React Router | 6.x |
| Backend | Node.js + Express | 25.x / 4.x |
| Database | MongoDB + Mongoose | 8.x / 8.x |
| Auth | JWT + bcryptjs | — |
| Validation | express-validator | 7.x |

---

## 4. Specific Requirements

### 4.1 Functional Requirements

#### FR-01: User Registration
| Field | Detail |
|-------|--------|
| **ID** | FR-01 |
| **Title** | User Registration |
| **Description** | System shall allow new users to create an account with name, email, and password |
| **Input** | Name (2-50 chars), Email (valid format, unique), Password (min 6 chars) |
| **Process** | Validate input → Hash password (bcrypt, 10 rounds) → Store in database → Generate JWT |
| **Output** | JWT token + user profile data |
| **Priority** | High |

#### FR-02: User Login
| Field | Detail |
|-------|--------|
| **ID** | FR-02 |
| **Title** | User Authentication |
| **Description** | System shall authenticate users with email and password |
| **Input** | Email, Password |
| **Process** | Find user by email → Compare hashed password → Update streak → Generate JWT |
| **Output** | JWT token + user profile data |
| **Priority** | High |

#### FR-03: Medicine Reminder CRUD
| Field | Detail |
|-------|--------|
| **ID** | FR-03 |
| **Title** | Medicine Reminder Management |
| **Description** | Users shall create, read, update, and delete medicine reminders |
| **Input** | Medicine name, dosage, time, frequency, notes (optional) |
| **Process** | CRUD operations with user-scoped access control |
| **Output** | Reminder object with completion status |
| **Priority** | High |

#### FR-04: Medicine Completion Toggle
| Field | Detail |
|-------|--------|
| **ID** | FR-04 |
| **Title** | Mark Medicine as Taken |
| **Description** | Users shall toggle a medicine reminder's completion status |
| **Input** | Reminder ID |
| **Process** | Toggle isCompleted flag, record completedAt timestamp |
| **Output** | Updated reminder with completion status |
| **Priority** | High |

#### FR-05: Water Intake Logging
| Field | Detail |
|-------|--------|
| **ID** | FR-05 |
| **Title** | Log Water Intake |
| **Description** | Users shall log water consumption entries with amount in ml |
| **Input** | Amount (1-5000 ml) |
| **Process** | Create entry → Calculate daily total → Compare with goal |
| **Output** | Entry + daily total + percentage of goal |
| **Priority** | High |

#### FR-06: Water Daily Summary
| Field | Detail |
|-------|--------|
| **ID** | FR-06 |
| **Title** | View Today's Water Intake |
| **Description** | System shall show total water consumed today with all entries |
| **Input** | None (uses authenticated user ID + current date) |
| **Process** | Aggregate today's entries → Sum amounts → Calculate percentage |
| **Output** | Total amount, goal, percentage, list of entries |
| **Priority** | High |

#### FR-07: Water Weekly Trend
| Field | Detail |
|-------|--------|
| **ID** | FR-07 |
| **Title** | Weekly Water Trend |
| **Description** | System shall display water intake data for the last 7 days |
| **Input** | None |
| **Process** | Aggregation query grouping by date for past 7 days |
| **Output** | Array of daily totals with dates |
| **Priority** | Medium |

#### FR-08: Exercise Reminder CRUD
| Field | Detail |
|-------|--------|
| **ID** | FR-08 |
| **Title** | Exercise Reminder Management |
| **Description** | Users shall manage exercise reminders with type, duration, and calories |
| **Input** | Exercise name, type (cardio/strength/flexibility/balance/sports), duration, time, frequency, calories |
| **Process** | CRUD with user-scoped access |
| **Output** | Exercise reminder object |
| **Priority** | High |

#### FR-09: Health Tips Browsing
| Field | Detail |
|-------|--------|
| **ID** | FR-09 |
| **Title** | Browse Health Tips |
| **Description** | Users shall view categorized health tips with search and filter |
| **Input** | Optional: category filter, search query |
| **Process** | Query tips with optional category/search filters |
| **Output** | Filtered list of health tips |
| **Priority** | Medium |

#### FR-10: Daily Random Tips
| Field | Detail |
|-------|--------|
| **ID** | FR-10 |
| **Title** | Daily Health Tips |
| **Description** | System shall display randomly selected tips (one per category) daily |
| **Input** | None |
| **Process** | MongoDB $sample aggregation per category |
| **Output** | 5 random tips (one per category) |
| **Priority** | Medium |

#### FR-11: Dashboard Analytics
| Field | Detail |
|-------|--------|
| **ID** | FR-11 |
| **Title** | Analytics Dashboard |
| **Description** | System shall display aggregated health statistics |
| **Input** | None |
| **Process** | Multi-collection aggregation: medicine completion rate, water percentage, exercise rate, health score calculation |
| **Output** | Health score, completion rates, streaks, water progress |
| **Priority** | High |

#### FR-12: Dark Mode
| Field | Detail |
|-------|--------|
| **ID** | FR-12 |
| **Title** | Theme Toggle |
| **Description** | Users shall toggle between light and dark color themes |
| **Input** | Toggle action |
| **Process** | Update localStorage preference, apply CSS class |
| **Output** | Theme change applied across all pages |
| **Priority** | Low |

#### FR-13: Search & Filter
| Field | Detail |
|-------|--------|
| **ID** | FR-13 |
| **Title** | Search and Filter |
| **Description** | Users shall search medicines/exercises by name and filter by type/frequency |
| **Input** | Search query, filter value |
| **Process** | Query with regex match and enum filter |
| **Output** | Filtered results |
| **Priority** | Medium |

#### FR-14: Profile Management
| Field | Detail |
|-------|--------|
| **ID** | FR-14 |
| **Title** | User Profile |
| **Description** | Users shall view and update their name and daily water goal |
| **Input** | Name, daily water goal (ml) |
| **Process** | Update user document |
| **Output** | Updated user profile |
| **Priority** | Medium |

---

### 4.2 Non-Functional Requirements

#### NFR-01: Performance
- API response time shall be < 500ms for all endpoints
- Frontend initial load shall be < 3 seconds
- Dashboard aggregation queries shall complete within 1 second

#### NFR-02: Security
- Passwords shall be hashed using bcrypt with 10 salt rounds
- JWT tokens shall expire after 30 days
- API endpoints (except login/register) shall require valid JWT
- User data shall be scoped — users can only access their own data
- Input validation on all API endpoints using express-validator

#### NFR-03: Usability
- Responsive design supporting screen widths from 320px to 2560px
- WCAG-compliant color contrast ratios
- Toast notifications for all user actions
- Loading states for async operations

#### NFR-04: Reliability
- MongoDB connection retry logic (3 attempts)
- Graceful error handling on all API endpoints
- Client-side error boundaries

#### NFR-05: Scalability
- Compound indexes on frequently queried fields
- User-scoped queries prevent data leakage
- Stateless JWT authentication (no server sessions)

#### NFR-06: Maintainability
- MVC architecture for separation of concerns
- Modular route/controller/model structure
- Consistent API response format: `{ success, message, data }`

---

## 5. Database Design

### 5.1 ER Diagram

```
┌──────────────┐       ┌──────────────────┐
│    USER      │       │ MEDICINE_REMINDER│
│──────────────│       │──────────────────│
│ _id (PK)     │──1:N──│ _id (PK)         │
│ name         │       │ userId (FK)      │
│ email (UQ)   │       │ medicineName     │
│ password     │       │ dosage           │
│ role         │       │ time             │
│ dailyWaterGoal│      │ frequency        │
│ streak       │       │ isCompleted      │
│ lastActiveDate│      │ completedAt      │
└──────┬───────┘       └──────────────────┘
       │
       │               ┌──────────────────┐
       ├──────1:N──────│ WATER_TRACKER    │
       │               │──────────────────│
       │               │ _id (PK)         │
       │               │ userId (FK)      │
       │               │ amount           │
       │               │ timestamp        │
       │               └──────────────────┘
       │
       │               ┌──────────────────┐
       └──────1:N──────│EXERCISE_REMINDER │
                       │──────────────────│
                       │ _id (PK)         │
                       │ userId (FK)      │
                       │ exerciseName     │
                       │ exerciseType     │
                       │ duration         │
                       │ reminderTime     │
                       │ calories         │
                       │ isCompleted      │
                       └──────────────────┘

┌──────────────────┐
│   HEALTH_TIP     │
│──────────────────│
│ _id (PK)         │
│ title            │
│ content          │
│ category         │
│ icon             │
└──────────────────┘
```

### 5.2 Normalization (BCNF)

All collections satisfy BCNF:
- **1NF:** All attributes are atomic, no repeating groups
- **2NF:** No partial dependencies (single-field primary keys)
- **3NF:** No transitive dependencies
- **BCNF:** Every determinant is a candidate key

No data is duplicated across collections. User data is referenced by `userId` foreign key, not embedded.

### 5.3 Indexes

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| Users | `email` | Unique | Fast login lookup |
| MedicineReminders | `{userId, isCompleted}` | Compound | User-scoped queries |
| WaterTrackers | `{userId, timestamp}` | Compound | Daily aggregation |
| ExerciseReminders | `{userId, isCompleted}` | Compound | User-scoped queries |
| HealthTips | `{category}` | Single | Category filtering |

### 5.4 DBMS Features Demonstrated

| Feature | Implementation |
|---------|---------------|
| Primary Keys | MongoDB `_id` (auto-generated ObjectId) |
| Foreign Keys | `userId` field referencing User collection |
| UNIQUE Constraint | `email` field in User collection |
| NOT NULL | `required: true` on mandatory fields |
| CHECK Constraints | `enum`, `min`, `max`, `minlength` validators |
| Aggregation | `$group`, `$sum`, `$match`, `$sample`, `$sort` |
| Indexes | Compound indexes for query optimization |
| Referential Integrity | Mongoose `ref` + populate |

---

## 6. API Specification

### 6.1 Base URL
```
Development: http://localhost:5001/api
Production:  https://<render-app>.onrender.com/api
```

### 6.2 Authentication
All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

### 6.3 Endpoints Summary

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | /auth/register | No | Register user |
| 2 | POST | /auth/login | No | Login user |
| 3 | GET | /auth/profile | Yes | Get profile |
| 4 | PUT | /auth/profile | Yes | Update profile |
| 5 | GET | /medicines | Yes | List reminders |
| 6 | POST | /medicines | Yes | Create reminder |
| 7 | PUT | /medicines/:id | Yes | Update reminder |
| 8 | PATCH | /medicines/:id/complete | Yes | Toggle taken |
| 9 | DELETE | /medicines/:id | Yes | Delete reminder |
| 10 | POST | /water | Yes | Log water |
| 11 | GET | /water/today | Yes | Today's intake |
| 12 | GET | /water/weekly | Yes | Weekly trend |
| 13 | PUT | /water/goal | Yes | Update goal |
| 14 | DELETE | /water/:id | Yes | Delete entry |
| 15 | GET | /tips/daily | Yes | Daily tips |
| 16 | GET | /tips | Yes | All tips |
| 17 | GET | /tips/random | Yes | Random tip |
| 18 | POST | /tips | Admin | Create tip |
| 19 | PUT | /tips/:id | Admin | Update tip |
| 20 | DELETE | /tips/:id | Admin | Delete tip |
| 21 | GET | /exercises | Yes | List exercises |
| 22 | POST | /exercises | Yes | Create exercise |
| 23 | PUT | /exercises/:id | Yes | Update exercise |
| 24 | PATCH | /exercises/:id/complete | Yes | Toggle done |
| 25 | DELETE | /exercises/:id | Yes | Delete exercise |
| 26 | GET | /dashboard/stats | Yes | Aggregated stats |
| 27 | GET | /dashboard/weekly | Yes | Weekly trends |
| 28 | GET | /dashboard/quote | Yes | Random quote |

### 6.4 Response Format
```json
{
  "success": true,
  "message": "Operation description",
  "data": { },
  "count": 10
}
```

---

## 7. User Interface Design

### 7.1 Screen List

| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Login | /login | Email/password form with demo credentials |
| 2 | Register | /register | Name/email/password signup form |
| 3 | Dashboard | /dashboard | Stats cards, charts, health tip, quote |
| 4 | Medicines | /medicines | Reminder cards with CRUD + completion |
| 5 | Water Tracker | /water | Circular progress, quick-add, weekly chart |
| 6 | Exercises | /exercises | Exercise cards with type badges + CRUD |
| 7 | Health Tips | /health-tips | Category tabs, gradient tip cards |
| 8 | Profile | /profile | Avatar, editable fields, account info |

### 7.2 UI Components

| Component | Location | Features |
|-----------|----------|----------|
| Sidebar | All pages | Navigation links, logout, mobile responsive |
| Navbar | All pages | Greeting, search, dark mode toggle, notifications |
| Modal | CRUD pages | Add/edit forms with validation |
| Toast | Global | Success/error notifications |
| Charts | Dashboard, Water | Area, Bar, Pie charts (Recharts) |

---

## 8. Testing

### 8.1 Test Cases

| TC# | Module | Test Case | Expected Result |
|-----|--------|-----------|-----------------|
| TC01 | Auth | Register with valid data | Account created, JWT returned |
| TC02 | Auth | Register with duplicate email | Error: "Email already exists" |
| TC03 | Auth | Login with valid credentials | JWT returned, redirect to dashboard |
| TC04 | Auth | Login with wrong password | Error: "Invalid credentials" |
| TC05 | Medicine | Create reminder | Reminder appears in list |
| TC06 | Medicine | Mark as completed | Green checkmark, strikethrough text |
| TC07 | Medicine | Delete reminder | Removed from list |
| TC08 | Medicine | Search by name | Filtered results shown |
| TC09 | Water | Log 250ml | Progress bar updates, entry appears |
| TC10 | Water | Reach daily goal | "Goal reached" message shown |
| TC11 | Water | View weekly chart | 7-day bar chart rendered |
| TC12 | Exercise | Add exercise with calories | Exercise card with calorie badge |
| TC13 | Exercise | Filter by type | Only matching type shown |
| TC14 | Tips | View daily tips | 5 random tips displayed |
| TC15 | Tips | Filter by category | Category-specific tips shown |
| TC16 | Dashboard | View stats | All cards show correct data |
| TC17 | Dashboard | View charts | Charts render with data |
| TC18 | Profile | Update name | Name changed across app |
| TC19 | UI | Toggle dark mode | Theme switches, persists on reload |
| TC20 | UI | Mobile view | Sidebar collapses, layout adapts |

---

## 9. Deployment

| Environment | Service | URL |
|------------|---------|-----|
| Frontend (Demo) | Vercel | https://frontend-xi-inky-33.vercel.app |
| Backend | Render (when MongoDB connected) | — |
| Database | MongoDB Atlas (free tier) | — |
| Source Code | GitHub | https://github.com/PUNEETh111/healthtips |

---

## 10. Conclusion

The Smart Health Tips & Reminder System is a comprehensive, production-quality DBMS mini project that demonstrates:

- **Full-stack development** using the MERN stack
- **Database design** with BCNF normalization and proper constraints
- **Advanced queries** using MongoDB aggregation pipelines
- **Security** with JWT authentication and password hashing
- **Modern UI/UX** with responsive design, dark mode, and data visualization
- **RESTful API** design with 28 endpoints following best practices

The system is deployable, maintainable, and extensible for future enhancements such as push notifications, PDF health reports, and AI-powered health recommendations.

---

*Document prepared for DBMS Mini Project evaluation.*
