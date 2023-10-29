import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import User from "../models/user";

const api = supertest(app);

beforeEach(async () => {
  // Clear users collection before each test
  await User.deleteMany({});
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
      password: "testpassword",
    };

    await api
      .post("/api/users")
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
      password: "testpassword",
    };

    await api.post("/api/users").send(user);

    const result = await api.post("/api/users").send(user);

    expect(result.status).toBe(400); // Assuming 400 for validation errors
  });

  // ... other validation tests
});

describe("JSON Transformation Tests", () => {
  test("returned user object does not have passwordHash", async () => {
    const newUser = {
      username: "testuser2",
      name: "Test User 2",
      password: "testpassword2",
    };

    const result = await api.post("/api/users").send(newUser);

    expect(result.body.passwordHash).toBeUndefined();
    expect(result.body.id).toBeDefined();
    expect(result.body._id).toBeUndefined();
    expect(result.body.__v).toBeUndefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
