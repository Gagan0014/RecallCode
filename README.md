# RecallCode

A full-stack spaced repetition platform for retaining coding patterns.

RecallCode syncs your solved LeetCode problems and schedules reviews using an SM-2-based algorithm. You review a problem when it becomes due, rate how well you recalled it, and the app sets the next review date from that rating.

---

## Why RecallCode?

Solving a problem once doesn't mean you'll recognize the pattern months later. Binary search, sliding window, and DP state transitions fade without revision, and most people have no system for revisiting old problems.

RecallCode resurfaces previously solved problems at intervals that adapt to how well you remember them.

---

## Features

**LeetCode sync**
- Imports recently solved problems through the LeetCode GraphQL API.
- Creates problem records and per-user review records automatically.
- Prevents duplicate problems and duplicate user records.

**Spaced repetition**
- SM-2-based scheduling with ratings from 0 to 5.
- Per-user, per-problem ease factor, repetition count, interval, and next review date.
- Poor recall resets the repetition count so the problem comes back sooner.

**Reviews**
- Lists problems that are due, with a link to each on LeetCode.
- Updates the schedule when a rating is submitted.
- Configurable daily review limit.

**Email reminders**
- Daily reminders for due problems, sent with Node-Cron and Nodemailer.
- Per-user reminder time and timezone.

**Auth and access control**
- JWT authentication on protected routes (tokens expire after 7 days).
- Ownership checks so users can only modify their own review data.
- Admin-only routes controlled by an `isAdmin` flag.

---

## How It Works

```text
LeetCode username
  → sync solved problems
  → store problems in MongoDB
  → create a UserProblem record per user
  → problem becomes due
  → user reviews it and rates recall (0–5)
  → SM-2 parameters update
  → next review date is calculated
  → repeat
```

---

## Architecture

```text
React frontend (Vite)
        │  REST
        ▼
Express backend (Node.js)
  ├── Auth routes
  ├── Problem routes
  ├── Review routes
  └── Sync service ───────► LeetCode GraphQL API
        │
        ▼
MongoDB (Mongoose)

Node-Cron reminder job ──► Nodemailer ──► Gmail SMTP
```

---

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Node-Cron, Nodemailer |
| Integrations | LeetCode GraphQL API, Gmail SMTP |
| Testing | Jest, Supertest, MongoDB Memory Server, Axios mocking |

---

## Database Design

Three MongoDB collections.

**User**: account details, reminder settings, and admin flag.

```js
{
  name: String,
  email: String,
  password: String,
  leetcodeUsername: String,
  emailTime: String,
  timeZone: String,
  dailyReviewLimit: Number,
  lastReminderSent: Date,
  isAdmin: Boolean
}
```

**Problem**: shared problem data.

```js
{
  title: String,
  titleSlug: String,
  difficulty: String,
  tags: [String],
  leetcodeUrl: String
}
```

**UserProblems**: one user's review state for one problem.

```js
{
  userId: ObjectId,
  problemId: ObjectId,
  repetitions: Number,
  interval: Number,
  easeFactor: Number,
  nextReviewDate: Date
}
```

Keeping `Problem` separate from `UserProblems` lets many users share one problem record while each keeps an independent schedule.

---

## SM-2 Review System

| Rating | Meaning |
| --- | --- |
| 0 | Complete blackout |
| 1 | Incorrect recall |
| 2 | Difficult recall |
| 3 | Correct with effort |
| 4 | Good recall |
| 5 | Perfect recall |

The rating updates the ease factor, repetition count, interval, and next review date.

Interval progression after successful reviews:

- 1st review: 1 day
- 2nd review: 6 days
- Later reviews: previous interval × ease factor

A failed recall resets the repetition count.

---

## API Endpoints

**Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/preferences
```

**Users** (admin only)
```
GET    /api/users
POST   /api/users
```

**Problems**
```
POST   /api/problems
GET    /api/problems
GET    /api/problems/myproblems
GET    /api/problems/due
POST   /api/problems/rate
```

**User problems**
```
POST   /api/userproblems
GET    /api/userproblems        (admin only)
```

**LeetCode sync**
```
POST   /api/sync/sync
GET    /api/getProblems/recent/:username
```

**Health check**
```
GET    /
```

Protected endpoints require a header:

```
Authorization: Bearer <token>
```

---

## Testing

Backend tests use Jest and Supertest. MongoDB Memory Server provides an isolated in-memory database, and Axios is mocked so LeetCode requests don't hit the real API.

```text
Test Suites: 5 passed, 5 total
Tests:       30 passed, 30 total
```

Coverage by suite:

- **Auth**: registration, duplicate email, login, invalid password, unknown user, protected routes.
- **Problems**: creation, auth requirements, per-user retrieval, due problems, user isolation.
- **UserProblems**: creation, auth requirements, immediate scheduling, duplicate prevention, same problem across users.
- **Review**: successful review, reset on failed recall, interval progression, invalid ratings, auth, authorization, missing records.
- **Sync**: problem sync, duplicate prevention, reusing existing problems across users, auth, missing username, external API failure.

Run from the `backend` directory:

```bash
npm test
```

---

## Getting Started

### Environment variables

Create a `.env` file in `backend/`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Don't commit `.env` files or credentials.

### Install and run

```bash
git clone https://github.com/yourusername/recallcode.git
cd recallcode
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend (in a second terminal):

```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```text
RecallCode/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── problems.test.js
│   │   ├── review.test.js
│   │   ├── sync.test.js
│   │   ├── userProblems.test.js
│   │   └── setup.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Status

**Backend**
- [x] JWT authentication and protected routes
- [x] User preferences, timezone support, daily review limits
- [x] LeetCode synchronization
- [x] SM-2 scheduling and review ratings
- [x] Email reminders
- [x] Admin access control and user data isolation
- [x] Automated tests with MongoDB Memory Server

**Frontend**
- [x] Dashboard
- [x] Review interface
- [x] Problem management
- [x] Settings page
- [ ] Analytics dashboard
- [ ] Production deployment

---

## Planned

- Full LeetCode history sync
- Progress analytics and streak tracking
- Review statistics
- Mobile-friendly interface
- API rate limiting
- Docker setup
- GitHub Actions CI

---

## Author

Gagan Pathak
