// BoardFormModal.js
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { boardService } from "../services/board";

interface Props {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}

const BoardFormModal = ({ isOpen, setIsOpen }: Props) => {
  const [newBoardName, setNewBoardName] = useState("");

  const handleAddBoard = async () => {
    if (newBoardName) {
      try {
        await boardService.createBoard({ name: newBoardName });
        setIsOpen(false); // Close the modal on successful creation
      } catch (error) {
        console.error("Failed to create board:", error);
      }
    }
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

        {/* Modal panel */}
        <div className="fixed inset-0 z-10 overflow-y-auto ">
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
                  Add a New Board
                </Dialog.Title>
                <div className="mt-4">
                  <label htmlFor="boardName" className="input-label">
                    Board Name
                  </label>
                  <input
                    id="boardName"
                    type="text"
                    className="login-input"
                    placeholder="Board Name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="btn-primary max-w-[12rem]"
                    onClick={handleAddBoard}
                  >
                    Submit
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

export default BoardFormModal;
