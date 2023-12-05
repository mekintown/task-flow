import {
  BsPlus,
  BsFillLightningFill,
  BsGearFill,
  BsCloudHaze2Fill,
} from "react-icons/bs";

import { FaFire, FaPoo } from "react-icons/fa";
import SideBarIcon from "./SidebarIcon";

const Sidebar = () => {
  return (
    <div className="top-0 left-0 h-screen w-20 m-0 flex flex-col text-black border-r border-gray-900/10 shadow-lg">
      <SideBarIcon icon={<BsCloudHaze2Fill size="24" />} text="Home" />
      <hr className="sidebar-hr" />
      <SideBarIcon icon={<BsPlus size="32" />} text="Add Board +" />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<FaPoo size="20" />} />
      <SideBarIcon icon={<BsGearFill size="22" />} text="Setting" />
    </div>
  );
};

export default Sidebar;
