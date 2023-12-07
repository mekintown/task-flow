import { BsPlus, BsFillLightningFill, BsCloudHaze2Fill } from "react-icons/bs";

import { BiSolidLogOut } from "react-icons/bi";

import SideBarIcon from "./SidebarIcon";
import { useUserContext } from "../../context/UserContext";
import { Board, PopulatedCollaborator, UserBoard } from "../../types";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import BoardFormModal from "../BoardFormModal";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { boardService } from "../../services/board";

const Sidebar = () => {
  const [boards, setBoards] = useState<UserBoard[]>([]);
  console.log(boards);
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserBoards = async () => {
      try {
        const userBoards = await userService.getUserBoards();
        setBoards(userBoards);
      } catch (error) {
        console.error("Failed to fetch user boards:", error);
        // Handle the error based on your application's requirements
      }
    };
    fetchUserBoards();
  }, []);
  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`); // Navigate to board detail page
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

  const handleDeleteClick = async (boardId: string) => {
    try {
      // Call the service to delete the board, await the result to make sure it's been deleted
      await boardService.deleteBoard(boardId);
      // If the deletion was successful, filter out the deleted board from the local state
      setBoards(boards.filter((board) => board.boardId._id !== boardId));
      // Optionally, navigate to a confirmation page or display a success message
    } catch (error) {
      console.error("Failed to delete the board:", error);
      // Handle the error, such as displaying an error message to the user
    }
  };

  const handleLogoutClick = () => {
    logout();
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
      {boards.map((board) => (
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
