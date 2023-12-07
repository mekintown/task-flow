import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { taskService } from "../services/task";
import { Task, Priority, NewTask } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
}

const TaskDetailModal = ({ isOpen, setIsOpen, task }: Props) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || Priority.None);
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || Priority.None);
    // Convert dueDate to YYYY-MM-DD format
    if (task.dueDate) {
      const formattedDate = new Date(task.dueDate).toISOString().split("T")[0];
      setDueDate(formattedDate);
    } else {
      setDueDate("");
    }
  }, [task]);

  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: NewTask) =>
      taskService.updateTask(task.board, task.id, updatedTask),
    onSuccess: () => {
      // Invalidate and refetch

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleUpdateTask = () => {
    const updatedData: NewTask = {
      title,
      description,
      priority,
    };
    if (dueDate) {
      updatedData.dueDate = dueDate;
    }
    updateTaskMutation.mutate(updatedData, {
      onSuccess: () => {
        setIsOpen(false); // Close the modal on successful update
      },
    });
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Task Details
                </Dialog.Title>
                <div className="mt-4">
                  <label htmlFor="taskTitle" className="input-label">
                    Title
                  </label>
                  <input
                    id="taskTitle"
                    name="title"
                    type="text"
                    className="login-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label htmlFor="taskDescription" className="input-label mt-4">
                    Description
                  </label>
                  <textarea
                    id="taskDescription"
                    name="description"
                    className="login-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <label htmlFor="taskPriority" className="input-label mt-4">
                    Priority
                  </label>
                  <select
                    id="taskPriority"
                    name="priority"
                    className="login-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value={Priority.None}>None</option>
                    <option value={Priority.Low}>Low</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.High}>High</option>
                  </select>

                  <label htmlFor="taskDueDate" className="input-label mt-4">
                    Due Date
                  </label>
                  <input
                    id="taskDueDate"
                    name="dueDate"
                    type="date"
                    className="login-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="btn-primary max-w-[12rem]"
                    onClick={handleUpdateTask}
                  >
                    Update Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDetailModal;
