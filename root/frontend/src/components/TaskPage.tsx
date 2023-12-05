import React, { useEffect, useState } from "react";
import { Priority, Task, TasksWithPagination } from "../types"; // Import your Task type
import { taskService } from "../services/task";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundForward } from "react-icons/io";

const TaskPage = () => {
  const [tasksWithPagination, setTasksWithPagination] =
    useState<TasksWithPagination | null>(null);
  const [taskName, setTaskName] = useState("");
  const { boardId } = useParams();

  useEffect(() => {
    // Fetch tasks when the boardId changes
    if (boardId) {
      (async () => {
        try {
          const tasksFromService = await taskService.getTasksByBoard(boardId);
          setTasksWithPagination(tasksFromService);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      })();
    }
  }, [boardId]);

  const handleCreateTask = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (taskName && boardId) {
      try {
        const newTask = await taskService.createTask(boardId, {
          title: taskName,
        });
        if (tasksWithPagination) {
          setTasksWithPagination({
            ...tasksWithPagination,
            data: [...(tasksWithPagination?.data || []), newTask as Task],
          });
        } else {
          setTasksWithPagination({
            data: [newTask as Task],
            pagination: {
              currentPage: 0,
              totalPage: 0,
              totalTasks: 1,
              limit: 10,
            },
          });
        }
        setTaskName("");
      } catch (error) {
        console.error("Failed to create task:", error);
      }
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return "bg-red-500";
      case Priority.Medium:
        return "bg-yellow-500";
      case Priority.Low:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="h-screen p-4">
      <div className="mt-2 space-y-4">
        {/* Task input omitted for brevity */}
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-950"
        >
          {tasksWithPagination &&
            tasksWithPagination.data.map((task) => (
              <li
                key={task.id}
                className="bg-white dark:bg-gray-900 shadow overflow-hidden rounded-md px-6 py-4 my-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`h-4 w-4 rounded-full ${getPriorityColor(
                        task.priority ? task.priority : Priority.None
                      )} mr-3`}
                    ></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No due date"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <form
          onSubmit={(e) => handleCreateTask(e)}
          className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-sky-600"
        >
          <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
            +&nbsp;
            <span className="hidden sm:inline"> Add Task</span>&nbsp;|
          </span>
          <input
            type="text"
            name="taskName"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className=" block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none dark:text-white"
            placeholder="Need to contact mekintown"
          ></input>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-r-md border-0 bg-transparent p-2 text-gray-500 hover:text-gray-700"
          >
            <IoMdArrowRoundForward size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskPage;
