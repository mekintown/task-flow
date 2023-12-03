import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Board from "../models/board";
import User from "../models/user";
import { BoardCollaboration, Role } from "../types";
import testHelper from "./testHelper";

const api = supertest(app);

describe("Board API", () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Board.deleteMany({});
    authToken = await testHelper.createUserAndLogin();

    // Get user ID for testing user boards
    const userResponse = await api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${authToken}`);

    userId = userResponse.body.id as string;
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
    await testHelper.createBoard(authToken, { name: "Board 1" });
    await testHelper.createBoard(authToken, { name: "Board 2" });

    const response = await api
      .get("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  test("should retrieve a specific board by ID", async () => {
    const board = await testHelper.createBoard(authToken, {
      name: "Specific Board",
    });
    const boardId = board.id;

    const response = await api
      .get(`/api/boards/${boardId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.id).toBe(boardId.toString());
  });

  test("should update a board by owner", async () => {
    const board = await testHelper.createBoard(authToken, {
      name: "Test Board",
    });

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
    const board = await testHelper.createBoard(authToken, {
      name: "Test Board",
    });

    await api
      .delete(`/api/boards/${board.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    const boardAfterDelete = await Board.findById(board.id);
    expect(boardAfterDelete).toBeNull();
  });

  test("user boards should be updated when a new board is created", async () => {
    const newBoard = { name: "Test Board" };

    const response = await api
      .post("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBoard);

    const user = await User.findById(userId);
    expect(
      user!.boards.some(
        (board: BoardCollaboration) =>
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          board.boardId.toString() === response.body.id
      )
    ).toBeTruthy();
  });

  test("user boards should be updated with correct role when a new board is created", async () => {
    const newBoard = { name: "Test Board With Role" };

    await api
      .post("/api/boards")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBoard);

    const user = await User.findById(userId);
    expect(
      user!.boards.some((board) => board.role === Role.Owner)
    ).toBeTruthy();
  });

  test("board collaborators should be updated when a board is updated", async () => {
    // Create a second user to add as a collaborator
    const secondUserToken = await testHelper.createUserAndLogin(
      "seconduser",
      "Second User",
      "SecondPassword1"
    );
    const secondUserResponse = await api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${secondUserToken}`);

    const secondUserId = secondUserResponse.body.id as string;

    const board = await testHelper.createBoard(authToken, {
      name: "Collaborator Test Board",
    });

    const updatedBoardData = {
      name: "Updated Collaborator Board",
      collaborators: [{ userId: secondUserId, role: Role.Editor }],
    };

    await api
      .put(`/api/boards/${board.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedBoardData)
      .expect(200);

    const updatedUser = await User.findById(secondUserId);
    expect(
      updatedUser!.boards.some(
        (board: BoardCollaboration) => board.boardId === board.boardId
      )
    ).toBeTruthy();
  });

  test("user boards should be updated when a board is deleted", async () => {
    const board = await testHelper.createBoard(authToken, {
      name: "Delete Test Board",
    });

    await api
      .delete(`/api/boards/${board.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    const user = await User.findById(userId);
    expect(
      user!.boards.every(
        (board: BoardCollaboration) => board.boardId !== board.boardId
      )
    ).toBeTruthy();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
