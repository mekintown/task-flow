import { BsPlus, BsFillLightningFill, BsCloudHaze2Fill } from "react-icons/bs";

import { BiSolidLogOut } from "react-icons/bi";

import SideBarIcon from "./SidebarIcon";
import { useUserContext } from "../../context/UserContext";
import { PopulatedCollaborator, UserBoard } from "../../types";
import { useState } from "react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import BoardFormModal from "../BoardFormModal";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { boardService } from "../../services/board";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetching boards using useQuery
  const { data: boards, isLoading } = useQuery<UserBoard[]>({
    queryKey: ["boards"],
    queryFn: userService.getUserBoards,
  });

  // Mutation for deleting a board
  const deleteBoardMutation = useMutation({
    mutationFn: boardService.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] }); // Invalidate and refetch boards
    },
  });

  const handleDeleteClick = (boardId: string) => {
    deleteBoardMutation.mutate(boardId); // Use mutation to delete the board
  };

  const handleLogoutClick = () => {
    logout();
  };

  const handleEditClick = (
    boardId: string,
    boardName: string,
    collaborators: PopulatedCollaborator[]
  ) => {
    navigate(`/boards/${boardId}/edit`, {
      state: {
        boardId,
        boardName,
        collaborators,
      },
    });
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`); // Navigate to board detail page
  };

  return (
    <div className="top-0 left-0 h-screen w-16 sm:w-20 m-0 flex flex-col text-black border-r border-gray-900/10 shadow-lg dark:bg-gray-900">
      <SideBarIcon
        icon={<BsCloudHaze2Fill size="24" />}
        text="Boards"
        handleClick={() => navigate(`/boards`)}
      />
      <hr className="sidebar-hr" />
      <SideBarIcon
        icon={<BsPlus size="32" />}
        text="Add Board +"
        handleClick={() => setIsModalOpen(true)}
      />
      {boards &&
        boards.map((board) => (
          <ContextMenu.Root key={board._id}>
            <ContextMenu.Trigger asChild>
              <div>
                <SideBarIcon
                  icon={<BsFillLightningFill size="20" />}
                  text={board.boardId.name}
                  handleClick={() => handleBoardClick(board.boardId._id)}
                />
              </div>
            </ContextMenu.Trigger>
            <ContextMenu.Content className="bg-white dark:bg-gray-700 p-1 shadow-md rounded z-20">
              <ContextMenu.Item
                className="cursor-pointer p-1 dark:text-white"
                onSelect={() =>
                  handleEditClick(
                    board.boardId._id,
                    board.boardId.name,
                    board.boardId.collaborators
                  )
                }
              >
                Edit
              </ContextMenu.Item>
              <ContextMenu.Item
                className="cursor-pointer p-1 text-red-500"
                onSelect={() => handleDeleteClick(board.boardId._id)}
              >
                Delete
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      <hr className="sidebar-hr" />
      <SideBarIcon
        icon={<BiSolidLogOut size="24" />}
        text="Logout"
        handleClick={handleLogoutClick}
      />
      <BoardFormModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default Sidebar;
