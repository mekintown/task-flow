import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { boardService } from "../services/board";
import {
  NewBoard,
  PopulatedCollaborator,
  Role,
  UserBoard,
  isRole,
} from "../types";
import { userService } from "../services/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BoardEditPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [boardName, setBoardName] = useState(location.state?.boardName || "");
  const [collaborators, setCollaborators] = useState(
    location.state?.collaborators || []
  );
  const [newCollaboratorUsername, setNewCollaboratorUsername] = useState("");
  const [newCollaboratorRole, setNewCollaboratorRole] = useState(Role.Editor);
  const queryClient = useQueryClient();

  const updateBoardMutation = useMutation({
    mutationFn: (data: { boardId: string; updatedBoard: NewBoard }) =>
      boardService.updateBoard(data.boardId, data.updatedBoard),
    onSuccess: () => {
      // Optionally update the boards cache
      queryClient.setQueryData(["boards"], (oldBoards: UserBoard[]) =>
        oldBoards.map((b) =>
          b.boardId._id === boardId ? { ...b, name: boardName } : b
        )
      );
      navigate("/boards");
    },
  });

  useEffect(() => {
    setBoardName(location.state?.boardName || "");
    setCollaborators(location.state?.collaborators || []);
  }, [location.state]);

  const handleRoleChange = (userId: string, newRole: Role) => {
    console.log(collaborators);
    if (isRole(newRole)) {
      setCollaborators(
        collaborators.map((collab: PopulatedCollaborator) =>
          collab.userId._id === userId ? { ...collab, role: newRole } : collab
        )
      );
    }
  };

  const handleUpdateBoard = async () => {
    if (!boardId) {
      console.error("Board ID is undefined");
      return;
    }

    const collaboratorsToUpdate = collaborators.map(
      (collaborator: PopulatedCollaborator) => ({
        userId: collaborator.userId._id,
        role: collaborator.role,
      })
    );

    if (newCollaboratorUsername) {
      // Add logic to find user by username and get the user ID
      // For now, let's assume you have a function `findUserByUsername` that returns the user ID
      const newUser = await userService.findUserByUsername(
        newCollaboratorUsername
      );
      if (newUser) {
        collaboratorsToUpdate.push({
          userId: newUser.id,
          role: newCollaboratorRole,
        });
      }
    }

    updateBoardMutation.mutate({
      boardId, // Passing boardId
      updatedBoard: {
        name: boardName,
        collaborators: collaboratorsToUpdate,
      },
    });
  };

  return (
    <div className="min-h-screen  bg-white dark:bg-gray-800  p-6">
      <div
        className="max-w-5xl mx-auto rounded-lg 
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
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  htmlFor="addUser"
                >
                  Add Collaborator
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={newCollaboratorUsername}
                    onChange={(e) => setNewCollaboratorUsername(e.target.value)}
                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <select
                    value={newCollaboratorRole}
                    onChange={(e) =>
                      setNewCollaboratorRole(e.target.value as Role)
                    }
                    className="shadow-sm border rounded py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
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
