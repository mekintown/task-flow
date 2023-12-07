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
    <div>
      <input
        type="text"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
      />
      <button onClick={handleUpdateBoard}>Update Board Name</button>

      <input
        type="text"
        placeholder="Collaborator Username"
        value={collaborator}
        onChange={(e) => setCollaborator(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="editor">Editor</option>
        <option value="visitor">Visitor</option>
      </select>
      <button onClick={handleAddCollaborator}>Add Collaborator</button>
    </div>
  );
};

export default BoardEditPage;
