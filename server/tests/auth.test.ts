import request from "supertest";
import { app } from "../server";

describe("Auth Endpoints", () => {
  it("should register a new user and return token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should not register an user with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "duplicate@example.com",
      password: "pass123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "duplicate@example.com",
      password: "pass123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("it should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "login123",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "login123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("it should reject invalid login crdentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpassword" });
  });
});
