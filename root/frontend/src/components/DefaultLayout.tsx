import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className="flex dark:bg-gray-800">
      {showSidebar && <Sidebar />}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DefaultLayout;
