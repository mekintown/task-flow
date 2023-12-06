import { Request, Response } from "express";
import { HTTP_STATUS } from "../utils/constant";
import { toNewTask } from "../utils/validators";
import Task from "../models/task";
import { AuthorizeRequest, Priority } from "../types";
import Board from "../models/board";
import mongoose from "mongoose";

const createTask = async (request: AuthorizeRequest, response: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const boardId = request.params.boardId;
    const boardExists = await Board.exists({ _id: boardId });
    if (!boardExists) {
      response.status(HTTP_STATUS.NOT_FOUND).send({ error: "Board not found" });
      return;
    }

    const newTask = toNewTask(request.body);
    const task = new Task({
      ...newTask,
      createdBy: request.user._id,
      board: boardId,
      priority: newTask.priority || Priority.None,
    });

    const savedTask = await task.save({ session });

    // Update the corresponding board
    await Board.findByIdAndUpdate(
      boardId,
      { $push: { tasks: savedTask._id } },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();

    const savedTaskPopulated = await Task.findById(savedTask._id).populate({
      path: "createdBy",
      select: "username name",
    });

    response.status(HTTP_STATUS.CREATED).json(savedTaskPopulated);
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error; // This will be caught by your global error handler
  }
};

const getAllTasks = async (_request: Request, response: Response) => {
  const tasks = await Task.find({}).populate({
    path: "createdBy",
    select: "username name",
  });
  response.json(tasks);
};

const getTasksByBoard = async (
  request: AuthorizeRequest,
  response: Response
) => {
  // Retrieve 'page' and 'limit' from the query parameters and set default values if not provided
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 10; // Default is 10 tasks per page

  const boardId = request.params.boardId;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      response.status(HTTP_STATUS.NOT_FOUND).send({ error: "Board not found" });
      return;
    }

    // Get total count of tasks for pagination metadata
    const totalTasks = await Task.countDocuments({ board: boardId });

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Find tasks with pagination
    const tasks = await Task.find({ board: boardId })
      .sort({ createdAt: -1 }) // Sort by most recent. Adjust as needed.
      .skip(startIndex)
      .limit(limit)
      .exec();

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      limit,
    };

    response.json({
      pagination,
      data: tasks, // The paginated result tasks
    });
  } catch (error) {
    response.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteTask = async (request: AuthorizeRequest, response: Response) => {
  const { boardId, id } = request.params;
  const boardExists = await Board.exists({ _id: boardId });
  if (!boardExists) {
    response.status(HTTP_STATUS.NOT_FOUND).send({ error: "Board not found" });
    return;
  }
  // Remove task from board
  await Board.findByIdAndUpdate(boardId, {
    $pull: { tasks: id },
  });

  // Delete the task
  await Task.findByIdAndRemove(id);
  response.status(HTTP_STATUS.NO_CONTENT).end();
};

const updateTask = async (request: AuthorizeRequest, response: Response) => {
  const { title, description, priority, dueDate } = toNewTask(request.body);
  const updatedTask = await Task.findByIdAndUpdate(
    request.params.id,
    { title, description, priority, dueDate },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );

  response.json(updatedTask);
};

const taskController = {
  createTask,
  getAllTasks,
  getTasksByBoard,
  updateTask,
  deleteTask,
};

export default taskController;
