import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { boardService } from "../services/board";
import { Collaborator, PopulatedCollaborator, Role, isRole } from "../types";

const BoardEditPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [boardName, setBoardName] = useState(location.state?.boardName || "");
  const [collaborators, setCollaborators] = useState(
    location.state?.collaborators || []
  );
  const [newCollaborator, setNewCollaborator] = useState({
    username: "",
    role: Role.Editor, // Default role for new collaborator
  });

  useEffect(() => {
    // Assuming boardName and collaborators are passed correctly
    setBoardName(location.state?.boardName || "");
    setCollaborators(location.state?.collaborators || []);
  }, [location.state]);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setCollaborators(
      collaborators.map((collaborator: Collaborator) =>
        collaborator.userId === userId
          ? { ...collaborator, role: newRole }
          : collaborator
      )
    );
  };

  const handleUpdateBoard = async () => {
    if (!boardId) {
      console.error("Board ID is undefined");
      // Handle the undefined case - show an error or redirect
      return;
    }

    // Map the populated collaborators to the expected format (id and role only)
    const collaboratorsToUpdate = collaborators.map(
      (collaborator: PopulatedCollaborator) => ({
        userId: collaborator.userId._id, // Assuming _id is the field for the user's ID
        role: collaborator.role,
      })
    );

    try {
      await boardService.updateBoard(boardId, {
        name: boardName,
        collaborators: collaboratorsToUpdate,
      });
      navigate("/boards");
    } catch (error) {
      console.error("Error in updating board:", error);
    }
  };

  return (
    <div className="min-h-screen  dark:bg-gray-900 p-6">
      <div
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg 
      "
      >
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
            Edit Board: {boardName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
                htmlFor="boardName"
              >
                Board Name
              </label>
              <input
                type="text"
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
                htmlFor="addUser"
              >
                Add Collaborator
              </label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newCollaborator.username}
                  onChange={(e) =>
                    setNewCollaborator({
                      ...newCollaborator,
                      username: e.target.value,
                    })
                  }
                  className="shadow-sm border rounded-l w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
                <select
                  value={newCollaborator.role}
                  onChange={(e) =>
                    setNewCollaborator({
                      ...newCollaborator,
                      role: e.target.value as Role,
                    })
                  }
                  className="shadow-sm border-t border-b border-r rounded-r py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                >
                  {/* Iterate over roles */}
                  {Object.values(Role).map(
                    (roleValue) =>
                      roleValue !== Role.Owner && (
                        <option key={roleValue} value={roleValue}>
                          {roleValue}
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Table for existing collaborators */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <thead className="bg-sky-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                <tr>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {collaborators.map((collaborator: PopulatedCollaborator) => (
                  <tr key={collaborator.userId._id}>
                    <td className="py-3 px-6">{collaborator.userId.name}</td>
                    <td className="py-3 px-6">
                      {collaborator.userId.username}
                    </td>
                    <td className="py-3 px-6">
                      {collaborator.role === Role.Owner ? (
                        <span className="text-gray-900 dark:text-white">
                          {collaborator.role}
                        </span>
                      ) : (
                        <select
                          value={collaborator.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            if (isRole(newRole)) {
                              handleRoleChange(
                                collaborator.userId._id,
                                newRole
                              );
                            } else {
                              console.error("Invalid role:", newRole);
                            }
                          }}
                          className="shadow border rounded px-3 py-1 dark:bg-gray-700"
                        >
                          <option value={Role.Editor}>Editor</option>
                          <option value={Role.Visitor}>Visitor</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {collaborator.role !== "Owner" && (
                        <button
                          onClick={() =>
                            handleRoleChange(
                              collaborator.userId._id,
                              collaborator.role === Role.Editor
                                ? Role.Visitor
                                : Role.Editor
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          Change
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpdateBoard}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-150"
          >
            Update Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEditPage;
