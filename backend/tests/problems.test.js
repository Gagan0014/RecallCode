import request from "supertest";
import app from "../src/app.js";

describe("Problems API", () => {
  let token;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Problem Tester",
        email: "problem@example.com",
        password: "password123",
        leetcodeUsername: "problemuser",
      });

    token = response.body.token;
  });

  test("should create a problem for authenticated user", async () => {
    const response = await request(app)
      .post("/api/problems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        tags: "Array, Hash Table",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  test("should reject problem creation without authentication", async () => {
    const response = await request(app)
      .post("/api/problems")
      .send({
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should return authenticated user's problems", async () => {
    await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        tags: "Array",
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
      });

    const response = await request(app)
      .get("/api/problems/myproblems")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);

    expect(response.body[0].title).toBe("Two Sum");
    expect(response.body[0].difficulty).toBe("Easy");
  });

  test("should return due problems for authenticated user", async () => {
    await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Valid Parentheses",
        titleSlug: "valid-parentheses",
        difficulty: "Easy",
        tags: "Stack",
        leetcodeUrl:
          "https://leetcode.com/problems/valid-parentheses/",
      });

    const response = await request(app)
      .get("/api/problems/due")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("Valid Parentheses");
  });

  test("should not return another user's problems", async () => {
    await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Private Problem",
        titleSlug: "private-problem",
        difficulty: "Hard",
        leetcodeUrl:
          "https://leetcode.com/problems/private-problem/",
      });

    const secondUser = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "second@example.com",
        password: "password123",
        leetcodeUsername: "seconduser",
      });

    const secondToken = secondUser.body.token;

    const response = await request(app)
      .get("/api/problems/myproblems")
      .set("Authorization", `Bearer ${secondToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});