import request from "supertest";
import app from "../src/app.js";

describe("Review API", () => {
  let token;
  let userProblemId;

  beforeEach(async () => {
    // Create user
    const userResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Review Tester",
        email: "review@example.com",
        password: "password123",
        leetcodeUsername: "reviewuser",
      });

    token = userResponse.body.token;

    // Create a UserProblem
    const problemResponse = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        tags: "Array",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
      });

    userProblemId = problemResponse.body._id;
  });

  test("should rate a problem successfully", async () => {
    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 5,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.repetitions).toBe(1);
    expect(response.body.interval).toBe(1);
  });

  test("quality below 3 should reset repetitions and interval", async () => {
    // First successful review
    await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 5,
      });

    // Failed review
    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 2,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.repetitions).toBe(0);
    expect(response.body.interval).toBe(1);
  });

  test("second successful review should set interval to 6 days", async () => {
    await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 5,
      });

    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 5,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.repetitions).toBe(2);
    expect(response.body.interval).toBe(6);
  });

  test("should reject an invalid quality score", async () => {
    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: 6,
      });

    expect(response.statusCode).toBe(400);
  });

  test("should reject a negative quality score", async () => {
    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId,
        quality: -1,
      });

    expect(response.statusCode).toBe(400);
  });

  test("should reject rating without authentication", async () => {
    const response = await request(app)
      .post("/api/problems/rate")
      .send({
        userProblemId,
        quality: 5,
      });

    expect(response.statusCode).toBe(401);
  });

  test("should prevent one user from rating another user's problem", async () => {
    const secondUser = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "secondreview@example.com",
        password: "password123",
        leetcodeUsername: "secondreviewuser",
      });

    const secondToken = secondUser.body.token;

    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${secondToken}`)
      .send({
        userProblemId,
        quality: 5,
      });

    expect(response.statusCode).toBe(403);
  });

  test("should return 404 for a non-existent UserProblem", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app)
      .post("/api/problems/rate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userProblemId: fakeId,
        quality: 5,
      });

    expect(response.statusCode).toBe(404);
  });
});