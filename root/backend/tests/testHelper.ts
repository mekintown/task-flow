import supertest from "supertest";
import app from "../app";
import { Board, NewBoard } from "../types";

const api = supertest(app);

const createUserAndLogin = async (
  username: string = "testuser",
  name: string = "Test User",
  password: string = "Testpassword1"
) => {
  const user = {
    username,
    name,
    password,
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
  return response.body as Board;
};

const testHelper = { createUserAndLogin, createBoard };

export default testHelper;
