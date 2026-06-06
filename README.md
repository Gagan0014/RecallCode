# RecallCode

### Spaced Repetition Platform for Long-Term Coding Pattern Retention

RecallCode is a backend-driven learning platform that helps developers retain coding patterns, algorithms, and problem-solving techniques over time.

Instead of repeatedly solving new problems and forgetting previously learned concepts, RecallCode applies the SM-2 spaced repetition algorithm to automatically schedule reviews of solved LeetCode problems, helping users strengthen pattern recognition and maintain consistent practice.

---

## Why RecallCode?

Many developers solve hundreds of coding problems but gradually forget important concepts because there is no structured revision system.

For example:

* Solved Binary Search problems but forgot the pattern months later.
* Learned Sliding Window techniques but struggle to recognize them again.
* Practiced Dynamic Programming extensively but cannot recall common state transitions.
* Continuously solve new problems without revisiting old concepts.

RecallCode solves this by automatically resurfacing previously solved problems at scientifically optimized intervals.

---

## Key Features

### LeetCode Synchronization

* Import solved problems directly from LeetCode
* Sync recent accepted submissions
* Prevent duplicate problem imports
* Automatically create personalized review schedules

### Spaced Repetition Engine

* Implementation of the SM-2 algorithm
* Dynamic review interval calculation
* Adaptive ease factor adjustment
* Quality-based review ratings (0–5)
* Personalized scheduling for every problem

### Automated Review System

* Daily review reminders
* Due problem tracking
* Timezone-aware scheduling
* User-configurable daily review limits

### User Management

* JWT Authentication
* Protected Routes
* User Preferences
* Personalized Reminder Settings

### Email Reminder Workflow

* Automated reminder emails
* Direct LeetCode problem links
* Due problem notifications
* Daily review scheduling

---

## How It Works

```text
LeetCode Username
        ↓
Sync Solved Problems
        ↓
Store Problems in MongoDB
        ↓
Generate Review Schedule
        ↓
Send Reminder Email
        ↓
Review Problem
        ↓
Rate Recall Quality (0–5)
        ↓
Update Next Review Date
```

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Node-Cron
* Nodemailer

### Integrations

* LeetCode GraphQL API
* Gmail SMTP

---

## System Architecture

```text
LeetCode API
      │
      ▼
 Sync Service
      │
      ▼
 MongoDB
      │
      ▼
 SM-2 Scheduler
      │
      ▼
 Reminder Engine
      │
      ▼
 Email Notifications
      │
      ▼
 User Reviews
      │
      ▼
 Rating System
      │
      ▼
 Updated Schedule
```

---

## Database Design

### User

```javascript
{
  name: String,
  email: String,
  password: String,
  leetcodeUsername: String,
  reviewTime: String,
  emailTime: String,
  timeZone: String,
  dailyReviewLimit: Number,
  lastReminderSent: Date
}
```

### Problem

```javascript
{
  title: String,
  titleSlug: String,
  difficulty: String,
  tags: [String],
  leetcodeUrl: String
}
```

### UserProblems

```javascript
{
  userId: ObjectId,
  problemId: ObjectId,
  repetitions: Number,
  interval: Number,
  easeFactor: Number,
  nextReviewDate: Date
}
```

---

## SM-2 Review Ratings

RecallCode uses the SM-2 algorithm to adapt future review schedules.

| Rating | Meaning             |
| ------ | ------------------- |
| 0      | Complete blackout   |
| 1      | Incorrect recall    |
| 2      | Difficult recall    |
| 3      | Correct with effort |
| 4      | Good recall         |
| 5      | Perfect recall      |

The rating directly influences:

* Ease Factor
* Repetition Count
* Review Interval
* Next Review Date

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
POST /api/auth/preferences
```

### Problems

```http
POST /api/problems
GET  /api/problems
GET  /api/problems/due
GET  /api/problems/myproblems
POST /api/problems/rate
```

### Synchronization

```http
POST /api/sync/:username
```

### User Problems

```http
POST /api/userproblems
GET  /api/userproblems
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/recallcode.git
cd recallcode
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add the required variables.

### Start Development Server

```bash
npm run dev
```

---

## Technical Highlights

* Designed and implemented a complete SM-2 spaced repetition system for coding problem retention.
* Integrated LeetCode GraphQL APIs to synchronize solved problems automatically.
* Built a timezone-aware reminder engine using Node-Cron and Nodemailer.
* Implemented MongoDB relationships between Users, Problems, and UserProblems collections.
* Prevented duplicate imports using synchronization logic and compound indexing.
* Developed adaptive scheduling based on user recall performance.

---

## Current Status

### Backend Completed

* Authentication System
* User Preferences
* LeetCode Synchronization
* Problem Management
* SM-2 Scheduling Engine
* Review Rating System
* Automated Reminder Emails
* Timezone Support
* Daily Review Limits

### Frontend In Development

* React Dashboard
* Review Interface
* Settings Page
* Analytics Dashboard
* Deployment

---

## Future Enhancements

* Full LeetCode History Synchronization
* Progress Analytics Dashboard
* Learning Streak Tracking
* Pattern Mastery Insights
* Advanced Review Statistics
* Mobile-Friendly Interface
* Docker Deployment

---

## Author

**Gagan Pathak**

RecallCode was built to help developers move beyond short-term problem solving and develop long-term retention of coding patterns through structured, automated revision.
