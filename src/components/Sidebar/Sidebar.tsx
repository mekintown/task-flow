import { PiCloudBold, PiUsersThree } from "react-icons/pi";
import { LiaHomeSolid } from "react-icons/lia";

function Sidebar() {
  return (
    <nav>
      <div className="flex flex-col gap-8 p-8 border-r-[1px] border-neutral-200 h-full w-72">
        <PiCloudBold size={40} color="#10b981" />
        <div className="flex items-center gap-4">
          <LiaHomeSolid size={30} />
          <h2>Home</h2>
        </div>
        <div className="flex items-center gap-4">
          <PiUsersThree size={30} />
          <h2>Members</h2>
        </div>
        <div>
          <div className="flex justify-between gap-4">
            <h1>My Boards</h1>
            <button>+</button>
          </div>
          <div className="flex flex-col gap-2 px-2 mt-2">
            <h2>Test1</h2>
            <h2>Work</h2>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
