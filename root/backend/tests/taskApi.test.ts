import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Task from "../models/task";
import Board from "../models/board";
import User from "../models/user";
import testHelper from "./testHelper";
import { Priority } from "../types";

const api = supertest(app);

describe("Task API", () => {
  let authToken: string;
  let boardId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});
    authToken = await testHelper.createUserAndLogin();

    const board = await testHelper.createBoard(authToken, {
      name: "Test Board",
    });
    boardId = board.id;
  });

  test("should add a valid task and return it with a 201 status", async () => {
    const newTask = {
      title: "Test Task",
      description: "Task description",
      priority: "High",
      dueDate: new Date().toISOString(),
    };

    await api
      .post(`/api/tasks/${boardId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(newTask)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const tasksAtEnd = await Task.find({});
    expect(tasksAtEnd).toHaveLength(1);
    expect(tasksAtEnd[0].title).toBe(newTask.title);

    // Check if the task is added to the board
    const board = await Board.findById(boardId);
    expect(board!.tasks).toContainEqual(tasksAtEnd[0]._id);
  });

  test("should retrieve all tasks", async () => {
    // Add two tasks for testing
    await testHelper.createTask(authToken, boardId, {
      title: "Task 1",
      description: "Description 1",
      priority: Priority.Medium,
      dueDate: new Date().toISOString(),
    });
    await testHelper.createTask(authToken, boardId, {
      title: "Task 2",
      description: "Description 2",
      priority: Priority.High,
      dueDate: new Date().toISOString(),
    });

    const response = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });

  test("should retrieve tasks for a specific board", async () => {
    await testHelper.createTask(authToken, boardId, {
      title: "Board Task",
      description: "Board Description",
      priority: Priority.Low,
      dueDate: new Date().toISOString(),
    });

    const response = await api
      .get(`/api/tasks/${boardId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].title).toBe("Board Task");
  });

  test("should update a task", async () => {
    const task = await testHelper.createTask(authToken, boardId, {
      title: "Original Task",
      description: "Original Description",
      priority: Priority.Low,
      dueDate: new Date().toISOString(),
    });

    const updatedTaskData = {
      title: "Updated Task",
      description: "Updated Description",
      priority: "High",
      dueDate: new Date().toISOString(),
    };

    await api
      .put(`/api/tasks/${boardId}/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedTaskData)
      .expect(200);

    const updatedTask = await Task.findById(task.id);
    expect(updatedTask!.title).toBe(updatedTaskData.title);
    expect(updatedTask!.description).toBe(updatedTaskData.description);
  });

  test("should delete a task", async () => {
    const task = await testHelper.createTask(authToken, boardId, {
      title: "Task to Delete",
      description: "Delete this task",
      priority: Priority.Medium,
      dueDate: new Date().toISOString(),
    });

    await api
      .delete(`/api/tasks/${boardId}/${task.id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204);

    const taskAfterDelete = await Task.findById(task.id);
    expect(taskAfterDelete).toBeNull();

    // Check if the task is removed from the board
    const board = await Board.findById(boardId);
    expect(board!.tasks).not.toContainEqual(task._id);
  });

  test("should paginate tasks by returning the correct page and limit", async () => {
    const tasksIds = [];
    for (let i = 0; i < 15; i++) {
      const task = await testHelper.createTask(authToken, boardId, {
        title: `Task ${i}`,
        description: `Task description ${i}`,
        priority: Priority.High,
        dueDate: new Date().toISOString(),
      });
      tasksIds.push(task.id);
    }

    const page = 2;
    const limit = 5;

    const response = await api
      .get(`/api/tasks/${boardId}?page=${page}&limit=${limit}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Check if the response contains the correct number of tasks
    expect(response.body.data).toHaveLength(limit);

    // Check if the pagination metadata is correct
    expect(response.body.pagination.currentPage).toBe(page);
    expect(response.body.pagination.totalPages).toBe(
      Math.ceil(tasksIds.length / limit)
    );
    expect(response.body.pagination.totalTasks).toBe(tasksIds.length);
    expect(response.body.pagination.limit).toBe(limit);
  }, 100000);

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
