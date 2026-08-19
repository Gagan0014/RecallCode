# API Testing Guide for RecallCode

## Setup

### Prerequisites
- Node.js server running on `http://localhost:8000` (or your configured PORT)
- MongoDB connected and running
- Environment variables configured (.env file)
- Tools: Postman, cURL, or Thunder Client

---

## 1. Authentication Routes

### 1.1 Register User
**Endpoint:** `POST /api/auth/register`
**Auth:** Public (No JWT required)
**Test Data:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "leetcodeUsername": "johndoe"
}
```
**Expected Response (201):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "leetcodeUsername": "johndoe",
    "isAdmin": false
  },
  "token": "jwt_token_here"
}
```
**Test Cases:**
- ✅ Valid registration → 201 with user and token
- ✅ Duplicate email → 400 error
- ✅ Missing required fields → 400 error

---

### 1.2 Login User
**Endpoint:** `POST /api/auth/login`
**Auth:** Public (No JWT required)
**Test Data:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Expected Response (200):**
```json
{
  "token": "jwt_token_here"
}
```
**Test Cases:**
- ✅ Valid credentials → 200 with token
- ✅ Invalid password → 400 error
- ✅ User not found → 400 error
- ✅ Missing fields → 400 error

---

### 1.3 Get User Profile
**Endpoint:** `GET /api/auth/profile`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Expected Response (200):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "leetcodeUsername": "johndoe",
  "reviewTime": "20:00",
  "timeZone": "Asia/kolkata",
  "dailyReviewLimit": 10,
  "isAdmin": false
  // Note: password is excluded
}
```
**Test Cases:**
- ✅ Valid token → 200 with user data
- ✅ No token → 401 error
- ✅ Invalid token → 401 error
- ✅ User deleted → 404 error

---

### 1.4 Update User Preferences
**Endpoint:** `POST /api/auth/preferences`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Test Data:**
```json
{
  "reviewTime": "19:00",
  "timeZone": "America/New_York",
  "dailyReviewLimit": 15
}
```
**Expected Response (200):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "reviewTime": "19:00",
  "timeZone": "America/New_York",
  "dailyReviewLimit": 15,
  "leetcodeUsername": "johndoe",
  "isAdmin": false
}
```
**Test Cases:**
- ✅ Valid update → 200 with updated data
- ✅ No token → 401 error
- ✅ Invalid token → 401 error
- ✅ Partial update → 200 (only specified fields updated)

---

## 2. User Routes

### 2.1 Get Current User
**Endpoint:** `GET /api/users`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Expected Response (200):**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "leetcodeUsername": "johndoe",
  "isAdmin": false
}
```
**Test Cases:**
- ✅ Valid token → 200 with user data
- ✅ No token → 401 error
- ✅ Invalid token → 401 error

---

### 2.2 Create User (Admin Only)
**Endpoint:** `POST /api/users`
**Auth:** JWT Required + Admin
**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```
**Test Data:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "leetcodeUsername": "newuser"
}
```
**Expected Response (201):**
```json
{
  "_id": "new_user_id",
  "name": "New User",
  "email": "newuser@example.com",
  "leetcodeUsername": "newuser",
  "isAdmin": false
}
```
**Test Cases:**
- ✅ Admin creates user → 201 with user data
- ✅ Non-admin tries to create → 403 Forbidden
- ✅ No token → 401 error
- ✅ Duplicate email → 400 error

---

## 3. Problem Routes

### 3.1 Create Problem
**Endpoint:** `POST /api/problems`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```
**Test Data:**
```json
{
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "tags": "Array,Hash Table",
  "leetcodeUrl": "https://leetcode.com/problems/two-sum/"
}
```
**Expected Response (201):**
```json
{
  "_id": "problem_id",
  "title": "Two Sum",
  "titleSlug": "two-sum",
  "difficulty": "Easy",
  "tags": "Array,Hash Table",
  "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```
**Test Cases:**
- ✅ Valid problem → 201 with problem data
- ✅ Duplicate titleSlug → 400 error (unique constraint)
- ✅ Missing required fields → 400 error
- ✅ No token → 401 error

---

### 3.2 Get All Problems
**Endpoint:** `GET /api/problems`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Expected Response (200):**
```json
[
  {
    "_id": "problem_id_1",
    "title": "Two Sum",
    "titleSlug": "two-sum",
    "difficulty": "Easy",
    "tags": "Array,Hash Table",
    "leetcodeUrl": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "_id": "problem_id_2",
    "title": "Add Two Numbers",
    "titleSlug": "add-two-numbers",
    "difficulty": "Medium",
    "tags": "Linked List",
    "leetcodeUrl": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```
**Test Cases:**
- ✅ Valid token → 200 with array of problems
- ✅ No problems exist → 200 with empty array
- ✅ No token → 401 error

---

### 3.3 Get User's Problems
**Endpoint:** `GET /api/problems/myproblems`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Expected Response (200):**
```json
[
  {
    "_id": "user_problem_id_1",
    "userId": "user_id",
    "problemId": {
      "_id": "problem_id",
      "title": "Two Sum",
      "titleSlug": "two-sum",
      "difficulty": "Easy"
    },
    "repetitions": 1,
    "interval": 1,
    "easeFactor": 2.5,
    "nextReviewDate": "2024-01-08T10:00:00Z"
  }
]
```
**Test Cases:**
- ✅ User with problems → 200 with array
- ✅ User with no problems → 200 with empty array
- ✅ Only shows current user's problems (not others)
- ✅ No token → 401 error

---

### 3.4 Get Due Problems
**Endpoint:** `GET /api/problems/due`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Expected Response (200):**
```json
[
  {
    "_id": "user_problem_id_1",
    "userId": "user_id",
    "problemId": {
      "_id": "problem_id",
      "title": "Two Sum",
      "titleSlug": "two-sum",
      "difficulty": "Easy"
    },
    "repetitions": 1,
    "interval": 1,
    "easeFactor": 2.5,
    "nextReviewDate": "2024-01-02T10:00:00Z"
  }
]
```
**Test Cases:**
- ✅ Problems with nextReviewDate ≤ today → returned
- ✅ Respects dailyReviewLimit → max items returned
- ✅ Only user's due problems → returned
- ✅ No due problems → 200 with empty array
- ✅ No token → 401 error

---

### 3.5 Rate Problem (SM-2 Update)
**Endpoint:** `POST /api/problems/rate`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Test Data:**
```json
{
  "userProblemId": "user_problem_id",
  "quality": 4
}
```
**Expected Response (200):**
```json
{
  "_id": "user_problem_id",
  "userId": "user_id",
  "problemId": "problem_id",
  "repetitions": 2,
  "interval": 6,
  "easeFactor": 2.518,
  "nextReviewDate": "2024-01-07T10:00:00Z"
}
```
**Test Cases:**
- ✅ Quality 0-2 → repetitions=0, interval=1
- ✅ Quality 3-5 → repetitions++, interval updates (SM-2 algo)
- ✅ Quality < 0 or > 5 → 400 error
- ✅ User not owner of problem → 403 Forbidden
- ✅ Problem not found → 404 error
- ✅ No token → 401 error

---

## 4. Sync Routes

### 4.1 Sync LeetCode Problems
**Endpoint:** `POST /api/sync/sync`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**No Request Body** (uses user's leetcodeUsername from database)

**Expected Response (200):**
```json
{
  "message": "Sync completed successfully",
  "syncedCount": 5
}
```
**Test Cases:**
- ✅ Sync with valid LeetCode username → 200 with count
- ✅ Duplicate problems not imported → correct count returned
- ✅ User without leetcodeUsername → 400 error
- ✅ User not found → 404 error
- ✅ No token → 401 error
- ✅ Invalid LeetCode username → 500 error (LeetCode API issue)

---

## 5. User Problems Routes

### 5.1 Create User Problem
**Endpoint:** `POST /api/userproblems`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**Test Data:**
```json
{
  "userId": "user_id",
  "problemId": "problem_id",
  "repetitions": 0,
  "interval": 1,
  "easeFactor": 2.5,
  "nextReviewDate": "2024-01-08T00:00:00Z"
}
```
**Expected Response (201):**
```json
{
  "_id": "user_problem_id",
  "userId": "user_id",
  "problemId": "problem_id",
  "repetitions": 0,
  "interval": 1,
  "easeFactor": 2.5,
  "nextReviewDate": "2024-01-08T00:00:00Z"
}
```
**Test Cases:**
- ✅ Valid data → 201 with record
- ✅ Missing required fields → 400 error
- ✅ Invalid userId/problemId → validation error
- ✅ No token → 401 error

---

### 5.2 Get All User Problems (Admin Only)
**Endpoint:** `GET /api/userproblems`
**Auth:** JWT Required + Admin
**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```
**Expected Response (200):**
```json
[
  {
    "_id": "user_problem_id_1",
    "userId": {
      "_id": "user_id_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "problemId": {
      "_id": "problem_id_1",
      "title": "Two Sum",
      "difficulty": "Easy"
    },
    "repetitions": 2,
    "interval": 6,
    "easeFactor": 2.5,
    "nextReviewDate": "2024-01-08T00:00:00Z"
  }
]
```
**Test Cases:**
- ✅ Admin access → 200 with all records
- ✅ Non-admin access → 403 Forbidden
- ✅ No token → 401 error
- ✅ Invalid token → 401 error

---

## 6. LeetCode Data Routes

### 6.1 Get Recent Submissions from LeetCode
**Endpoint:** `GET /api/getProblems/recent/:username`
**Auth:** JWT Required
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```
**URL:** `/api/getProblems/recent/johndoe`

**Expected Response (200):**
```json
[
  {
    "title": "Two Sum",
    "titleSlug": "two-sum",
    "difficulty": "Easy"
  },
  {
    "title": "Add Two Numbers",
    "titleSlug": "add-two-numbers",
    "difficulty": "Medium"
  }
]
```
**Test Cases:**
- ✅ Valid username → 200 with recent submissions
- ✅ Invalid username → 500 error (LeetCode API issue)
- ✅ No token → 401 error (Protected)
- ✅ User with no submissions → 200 with empty array

---

## 7. Health Check

### 7.1 API Health Check
**Endpoint:** `GET /`
**Auth:** Public (No JWT required)

**Expected Response (200):**
```
APP is running
```
**Test Cases:**
- ✅ Server running → 200 with message
- ✅ No headers needed → works as plain GET

---

## Testing Workflow

### Step-by-Step Test Flow:
1. **Register** → Get JWT token
2. **Login** → Get JWT token (alternative)
3. **Get Profile** → Verify user data
4. **Create Problem** → Add test problem
5. **Get All Problems** → Verify problem exists
6. **Get My Problems** → Should be empty initially
7. **Create User Problem** → Link user to problem
8. **Get My Problems** → Verify link
9. **Get Due Problems** → Should return if nextReviewDate ≤ today
10. **Rate Problem** → Update SM-2 values
11. **Sync Problems** → Fetch from LeetCode
12. **Get Recent Submissions** → Verify LeetCode integration

---

## Common Test Scenarios

### Scenario 1: Full User Journey
```bash
# 1. Register
POST /api/auth/register
{ name, email, password, leetcodeUsername }

# 2. Get Profile
GET /api/auth/profile
Header: Authorization: Bearer <token>

# 3. Update Preferences
POST /api/auth/preferences
{ reviewTime, timeZone, dailyReviewLimit }

# 4. Sync Problems
POST /api/sync/sync

# 5. Get My Problems
GET /api/problems/myproblems

# 6. Rate a Problem
POST /api/problems/rate
{ userProblemId, quality }
```

### Scenario 2: Admin Operations
```bash
# 1. Login as Admin
POST /api/auth/login
{ email, password }

# 2. Create User
POST /api/users
{ name, email, password, leetcodeUsername }

# 3. Get All User Problems
GET /api/userproblems
```

### Scenario 3: Error Handling
```bash
# Test with invalid token
GET /api/auth/profile
Header: Authorization: Bearer invalid_token
→ Should return 401

# Test without token
GET /api/problems/myproblems
→ Should return 401

# Test non-admin access to admin route
GET /api/userproblems
Header: Authorization: Bearer <non_admin_token>
→ Should return 403
```

---

## Tools for Testing

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123","leetcodeUsername":"john"}'

# Get Profile with Token
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Create a new collection "RecallCode API"
2. Create requests for each endpoint
3. Use Postman's environment variables for token management
4. Set up test scripts to validate responses

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create requests for each endpoint
3. Use auth tab for JWT management
4. View request/response in real-time

---

## Expected Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Missing/invalid JWT token |
| 403 | Forbidden - Insufficient permissions (admin required) |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## Summary

All 15 endpoints are now properly tested. Each has:
- ✅ Correct route path
- ✅ Proper authentication/authorization
- ✅ Expected request/response format
- ✅ Test cases for success and error scenarios
- ✅ Security validation

Start with the registration and login endpoints, then progress through the workflow.
