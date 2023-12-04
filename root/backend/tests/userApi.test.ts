import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import User from "../models/user";
import Board from "../models/board";

const api = supertest(app);

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
  await Board.deleteMany({});
});

describe("Users API", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("a valid user can be added", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "Testpassword1",
    };

    await api
      .post("/api/auth/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await User.find({});
    const usernames = usersAtEnd.map((u) => u.username);

    expect(usersAtEnd).toHaveLength(1);
    expect(usernames).toContain(newUser.username);
  });
});

describe("Validation Tests", () => {
  test("user with an already taken username cannot be added", async () => {
    const user = {
      username: "testuser",
      name: "Test User",
      password: "Testpassword1",
    };

    await api.post("/api/auth/register").send(user);

    const result = await api.post("/api/auth/register").send(user);

    expect(result.status).toBe(400);
  });

  test("adding a user with a password less than 8 characters", async () => {
    const result = await api.post("/api/auth/register").send({
      username: "testuser",
      name: "Test User",
      password: "Test1",
    });

    expect(result.status).toBe(400);
  });

  test("adding a user with a password without uppercase characters", async () => {
    const result = await api.post("/api/auth/register").send({
      username: "testuser",
      name: "Test User",
      password: "testpassword1",
    });

    expect(result.status).toBe(400);
  });

  test("adding a user with a password without lowercase characters", async () => {
    const result = await api.post("/api/auth/register").send({
      username: "testuser",
      name: "Test User",
      password: "TESTPASSWORD1",
    });

    expect(result.status).toBe(400);
  });

  test("adding a user with a password without numbers", async () => {
    const result = await api.post("/api/auth/register").send({
      username: "testuser",
      name: "Test User",
      password: "TestPassword",
    });

    expect(result.status).toBe(400);
  });

  test("adding a user without a password", async () => {
    const result = await api.post("/api/auth/register").send({
      username: "testuser",
      name: "Test User",
    });

    expect(result.status).toBe(400);
  });

  test("adding a user without a username", async () => {
    const result = await api.post("/api/auth/register").send({
      name: "Test User",
      password: "Testpassword1",
    });

    expect(result.status).toBe(400);
  });
});

describe("JSON Transformation Tests", () => {
  test("returned user object does not have passwordHash", async () => {
    const newUser = {
      username: "testuser2",
      name: "Test User 2",
      password: "Testpassword1",
    };

    const result = await api.post("/api/auth/register").send(newUser);

    expect(result.body.passwordHash).toBeUndefined();
    expect(result.body.id).toBeDefined();
    expect(result.body._id).toBeUndefined();
    expect(result.body.__v).toBeUndefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
