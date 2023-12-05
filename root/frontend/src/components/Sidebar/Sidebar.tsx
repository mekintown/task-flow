import { BsPlus, BsFillLightningFill, BsCloudHaze2Fill } from "react-icons/bs";

import { BiSolidLogOut } from "react-icons/bi";

import SideBarIcon from "./SidebarIcon";
import { useUserContext } from "../../context/UserContext";
import { Board, UserBoard } from "../../types";
import { useEffect, useState } from "react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import BoardFormModal from "../BoardFormModal";

const Sidebar = () => {
  const [boards, setBoards] = useState<UserBoard[]>([]);
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

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="top-0 left-0 h-screen w-20 m-0 flex flex-col text-black border-r border-gray-900/10 shadow-lg dark:bg-gray-900">
      <SideBarIcon icon={<BsCloudHaze2Fill size="24" />} text="Home" />
      <hr className="sidebar-hr" />
      <SideBarIcon
        icon={<BsPlus size="32" />}
        text="Add Board +"
        handleClick={() => setIsModalOpen(true)}
      />
      {boards.map((board) => (
        <SideBarIcon
          key={board._id}
          icon={<BsFillLightningFill size="20" />}
          text={board.boardId.name}
          handleClick={() => handleBoardClick(board.boardId._id)}
        />
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
