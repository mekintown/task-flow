import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Board from "../models/board";
import User from "../models/user";
import { Board as BoardType, NewBoard } from "../types";

const api = supertest(app);

const createUserAndLogin = async () => {
  const user = {
    username: "testuser",
    name: "Test User",
    password: "Testpassword1",
  };

  await api.post("/api/users").send(user);
  const response = await api.post("/api/login").send({
    username: user.username,
    password: user.password,
  });

  return response.body.token as string;
};

const createBoard = async (authToken: string, boardData: NewBoard) => {
  const response = await api
    .post("/api/boards")
    .set("Authorization", `Bearer ${authToken}`)
    .send(boardData);
  return response.body as BoardType;
};

describe("Board API", () => {
  let authToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Board.deleteMany({});
    authToken = await createUserAndLogin();
  });

  test("should add a valid board and return it with a 201 status", async () => {
    const newBoard = {
      name: "Test Board",
    };

    await api
      .post("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBoard)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const boardsAtEnd = await Board.find({});
    expect(boardsAtEnd).toHaveLength(1);
    expect(boardsAtEnd[0].name).toBe(newBoard.name);
  });

  test("should retrieve all boards", async () => {
    await createBoard(authToken, { name: "Board 1" });
    await createBoard(authToken, { name: "Board 2" });

    const response = await api
      .get("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  test("should retrieve a specific board by ID", async () => {
    const board = await createBoard(authToken, { name: "Specific Board" });
    const boardId = board.id;

    const response = await api
      .get(`/api/boards/${boardId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.id).toBe(boardId.toString());
  });

  test("should update a board by owner", async () => {
    const board = await createBoard(authToken, { name: "Test Board" });

    const updatedBoardData = {
      name: "Updated Board Name",
    };

    await api
      .put(`/api/boards/${board.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedBoardData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBoard = await Board.findById(board.id);
    if (updatedBoard) {
      expect(updatedBoard.name).toBe(updatedBoardData.name);
    }
  });

  test("should delete a board", async () => {
    const board = await createBoard(authToken, { name: "Test Board" });

    await api
      .delete(`/api/boards/${board.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    const boardAfterDelete = await Board.findById(board.id);
    expect(boardAfterDelete).toBeNull();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
