import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        leetcodeUsername: "testuser",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  test("should not allow duplicate email registration", async () => {
    const user = {
      name: "Test User",
      email: "duplicate@example.com",
      password: "password123",
      leetcodeUsername: "testuser",
    };

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(response.statusCode).toBe(400);
  });

  test("should login with valid credentials", async () => {
    const user = {
      name: "Login User",
      email: "login@example.com",
      password: "password123",
      leetcodeUsername: "loginuser",
    };

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should reject invalid password", async () => {
    const user = {
      name: "Wrong Password",
      email: "wrong@example.com",
      password: "password123",
      leetcodeUsername: "wronguser",
    };

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test("should reject login for non-existent user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: "password123",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  test("should reject access to protected profile without token", async () => {
    const response = await request(app)
      .get("/api/auth/profile");

    expect(response.statusCode).toBe(401);
  });
});