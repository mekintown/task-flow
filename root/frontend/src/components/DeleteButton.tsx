// DeleteTaskButton.js
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri"; // This is just an example icon, you can choose any other

interface Props {
  id: string;
  onDelete: (arg0: string) => void;
}

const DeleteButton = ({ id, onDelete }: Props) => {
  return (
    <button
      onClick={() => onDelete(id)}
      className="flex items-center justify-center text-gray-400 hover:text-red-500"
    >
      <RiDeleteBin6Line
        className="transition duration-150 ease-in-out hover:scale-110 hover:animate-shake"
        size={20}
      />
    </button>
  );
};

export default DeleteButton;
