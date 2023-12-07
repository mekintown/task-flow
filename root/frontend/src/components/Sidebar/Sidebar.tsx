import { BsPlus, BsFillLightningFill, BsCloudHaze2Fill } from "react-icons/bs";

import { BiSolidLogOut } from "react-icons/bi";

import SideBarIcon from "./SidebarIcon";
import { useUserContext } from "../../context/UserContext";
import { Board, UserBoard } from "../../types";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import BoardFormModal from "../BoardFormModal";

interface ContextMenuState {
  board: UserBoard | null;
  x: number;
  y: number;
}

const Sidebar = () => {
  const [boards, setBoards] = useState<UserBoard[]>([]);
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    board: null,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (
  //     event: React.MouseEvent<Element, MouseEvent>
  //   ) => {
  //     if (
  //       contextMenuRef.current &&
  //       !contextMenuRef.current.contains(event.target)
  //     ) {
  //       setContextMenu({ board: null, x: 0, y: 0 }); // Close the context menu
  //     }
  //   };

  //   document.addEventListener("mousedown", (e) => handleClickOutside(e));
  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener("mousedown", (e) => handleClickOutside(e));
  //   };
  // }, []);

  const handleRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    board: UserBoard
  ) => {
    event.preventDefault();
    setContextMenu({ board, x: event.clientX, y: event.clientY });
  };

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

  const handleBoardClick = (boardId: string, boardName: string) => {
    navigate(`/boards/${boardId}`); // Navigate to board detail page
  };

  const handleEditClick = (boardId: string, boardName: string) => {
    navigate(`/boards/${boardId}/edit`, {
      state: {
        boardId: boardId,
        boardName: boardName,
      },
    });
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
      {contextMenu.board && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white p-2 border z-20"
        >
          {contextMenu.board && (
            <div
              ref={contextMenuRef} // Attach the ref here
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={() =>
                handleEditClick(
                  contextMenu.board!._id,
                  contextMenu.board!.boardId.name
                )
              }
            >
              Edit
            </div>
          )}
          <div
            onClick={() => {
              /* delete logic here */
            }}
            className="text-red-500"
          >
            Delete
          </div>
        </div>
      )}
      {boards.map((board) => (
        <div
          key={board._id}
          onContextMenu={(event) => handleRightClick(event, board)}
        >
          <SideBarIcon
            icon={<BsFillLightningFill size="20" />}
            text={board.boardId.name}
            handleClick={() =>
              handleBoardClick(board.boardId._id, board.boardId.name)
            }
          />
        </div>
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
