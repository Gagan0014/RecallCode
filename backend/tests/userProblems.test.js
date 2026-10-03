import request from "supertest";
import app from "../src/app.js";

describe("UserProblems API", () => {
  let token;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "UserProblem Tester",
        email: "userproblem@example.com",
        password: "password123",
        leetcodeUsername: "userproblemuser",
      });

    token = response.body.token;
  });

  test("should create a UserProblem for authenticated user", async () => {
    const response = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Binary Search",
        titleSlug: "binary-search",
        difficulty: "Medium",
        tags: "Array, Binary Search",
        leetcodeUrl:
          "https://leetcode.com/problems/binary-search/",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("problemId");
    expect(response.body).toHaveProperty("nextReviewDate");
  });

  test("should reject UserProblem creation without authentication", async () => {
    const response = await request(app)
      .post("/api/userproblems")
      .send({
        title: "Binary Search",
        titleSlug: "binary-search",
        difficulty: "Medium",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should create a problem that is due immediately", async () => {
    const response = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Merge Sort",
        titleSlug: "merge-sort",
        difficulty: "Medium",
        tags: "Sorting",
      });

    expect(response.statusCode).toBe(201);

    const nextReviewDate = new Date(response.body.nextReviewDate);

    expect(nextReviewDate.getTime()).toBeLessThanOrEqual(
      Date.now()
    );
  });

  test("should reject duplicate UserProblem for the same user", async () => {
    const problem = {
      title: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
      tags: "Array",
      leetcodeUrl:
        "https://leetcode.com/problems/two-sum/",
    };

    const firstResponse = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send(problem);

    expect(firstResponse.statusCode).toBe(201);

    const secondResponse = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send(problem);

    expect(secondResponse.statusCode).toBe(400);
  });

  test("should allow different users to create the same problem", async () => {
    const problem = {
      title: "Two Sum",
      titleSlug: "two-sum",
      difficulty: "Easy",
      tags: "Array",
      leetcodeUrl:
        "https://leetcode.com/problems/two-sum/",
    };

    const firstResponse = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${token}`)
      .send(problem);

    expect(firstResponse.statusCode).toBe(201);

    const secondUser = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "seconduserproblem@example.com",
        password: "password123",
        leetcodeUsername: "seconduserproblem",
      });

    const secondToken = secondUser.body.token;

    const secondResponse = await request(app)
      .post("/api/userproblems")
      .set("Authorization", `Bearer ${secondToken}`)
      .send(problem);

    expect(secondResponse.statusCode).toBe(201);
  });
});