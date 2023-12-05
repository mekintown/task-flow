import { RiUserFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";

function TopMenu() {
  return (
    <nav className="absolute w-screen bg-white drop-shadow">
      <div className="mx-auto  px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div></div>
          <div className="flex gap-4 items-center">
            <IoMdNotifications />
            <p className="text-gray-400 text-3xl font-thin">|</p>
            <RiUserFill />
            <a>Test User</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default TopMenu;
