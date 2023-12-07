// BoardEditPage.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { boardService } from "../services/board";

const BoardEditPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [boardName, setBoardName] = useState(location.state?.boardName || "");
  const [collaborator, setCollaborator] = useState("");
  const [role, setRole] = useState("editor"); // default role

  useEffect(() => {
    setBoardName(location.state?.boardName || "");
    setCollaborator(location.state?.collaborator || "");
  }, [boardId, boardName]);

  const handleUpdateBoard = async () => {
    if (!boardId) {
      console.error("Board ID is undefined");
      // Handle the undefined case - show an error or redirect
      return;
    }

    try {
      await boardService.updateBoard(boardId, { name: boardName });
      navigate("/boards");
    } catch (error) {
      console.error("Error in updating board:", error);
    }
  };

  const handleAddCollaborator = async () => {
    // Logic to add collaborator
    console.log("Add Collaborator:", collaborator, "with role:", role);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 p-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Edit Board
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            htmlFor="boardName"
          >
            Board Name
          </label>
          <input
            type="text"
            id="boardName"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          onClick={handleUpdateBoard}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6"
        >
          Update Board Name
        </button>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            htmlFor="collaborator"
          >
            Collaborator Username
          </label>
          <input
            type="text"
            id="collaborator"
            placeholder="Collaborator Username"
            value={collaborator}
            onChange={(e) => setCollaborator(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="editor">Editor</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
        <button
          onClick={handleAddCollaborator}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Collaborator
        </button>
      </div>
    </div>
  );
};

export default BoardEditPage;
