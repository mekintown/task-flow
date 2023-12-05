import React, { useEffect, useState } from "react";
import { Priority, TasksWithPagination } from "../types"; // Import your Task type
import { taskService } from "../services/task";
import { useParams } from "react-router-dom";

const TaskPage = () => {
  const [tasksWithPagination, setTasksWithPagination] =
    useState<TasksWithPagination | null>(null);
  const { boardId } = useParams();
  useEffect(() => {
    const fetchTasks = async (id: string) => {
      try {
        const tasksFromService = await taskService.getTasksByBoard(id);
        setTasksWithPagination(tasksFromService);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    if (boardId) {
      fetchTasks(boardId);
    }
  }, [boardId]);

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
        <ul role="list" className="divide-y divide-gray-200">
          {tasksWithPagination &&
            tasksWithPagination.data.map((task) => (
              <li
                key={task.id}
                className="bg-white shadow overflow-hidden rounded-md px-6 py-4 my-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`h-4 w-4 rounded-full ${getPriorityColor(
                        Priority.Low
                      )} mr-3`}
                    ></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        Yeha
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {new Date("21/8/9").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskPage;
