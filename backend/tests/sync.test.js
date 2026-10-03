import User from "../src/models/User.js";
import request from "supertest";
import app from "../src/app.js";
import axios from "axios";
import { jest } from "@jest/globals";

jest.spyOn(axios, "post");

describe("Sync API", () => {
  let token;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Sync Tester",
        email: "sync@example.com",
        password: "password123",
        leetcodeUsername: "syncuser",
      });

    expect(response.statusCode).toBe(201);

    token = response.body.token;

    axios.post.mockReset();
  });

  test("should sync recently solved LeetCode problems", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          recentAcSubmissionList: [
            {
              id: "12345",
              title: "Two Sum",
              titleSlug: "two-sum",
              timestamp: "1700000000",
            },
            {
              id: "12346",
              title: "Binary Search",
              titleSlug: "binary-search",
              timestamp: "1700000001",
            },
          ],
        },
      },
    });

    const response = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Sync completed successfully"
    );
    expect(response.body.syncedCount).toBe(2);
  });

  test("should not create duplicate UserProblems when syncing again", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          recentAcSubmissionList: [
            {
              id: "12345",
              title: "Two Sum",
              titleSlug: "two-sum",
              timestamp: "1700000000",
            },
          ],
        },
      },
    });

    const firstResponse = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${token}`);

    expect(firstResponse.statusCode).toBe(200);
    expect(firstResponse.body.syncedCount).toBe(1);

    const secondResponse = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${token}`);

    expect(secondResponse.statusCode).toBe(200);
    expect(secondResponse.body.syncedCount).toBe(0);
  });

  test("should reuse an existing Problem when another user syncs it", async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          recentAcSubmissionList: [
            {
              id: "12345",
              title: "Two Sum",
              titleSlug: "two-sum",
              timestamp: "1700000000",
            },
          ],
        },
      },
    });

    const firstResponse = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${token}`);

    expect(firstResponse.statusCode).toBe(200);
    expect(firstResponse.body.syncedCount).toBe(1);

    const secondUser = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second Sync User",
        email: "secondsync@example.com",
        password: "password123",
        leetcodeUsername: "secondsyncuser",
      });

    expect(secondUser.statusCode).toBe(201);

    const secondToken = secondUser.body.token;

    const secondResponse = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${secondToken}`);

    expect(secondResponse.statusCode).toBe(200);
    expect(secondResponse.body.syncedCount).toBe(1);
  });

  test("should reject sync without authentication", async () => {
    const response = await request(app)
      .post("/api/sync/sync");

    expect(response.statusCode).toBe(401);
  });

test("should return 400 when LeetCode username is missing", async () => {
  const user = await User.findOne({
    email: "sync@example.com",
  });

  expect(user).not.toBeNull();

  user.leetcodeUsername = "";
  await user.save({ validateBeforeSave: false });

  const syncResponse = await request(app)
    .post("/api/sync/sync")
    .set("Authorization", `Bearer ${token}`);

  expect(syncResponse.statusCode).toBe(400);
  expect(syncResponse.body.message).toBe(
    "LeetCode username not set"
  );
});

  test("should return 500 when LeetCode service fails", async () => {
    axios.post.mockRejectedValue(
      new Error("LeetCode API unavailable")
    );

    const response = await request(app)
      .post("/api/sync/sync")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(
      "LeetCode API unavailable"
    );
  });
});