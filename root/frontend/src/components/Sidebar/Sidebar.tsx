import {
  BsPlus,
  BsFillLightningFill,
  BsGearFill,
  BsCloudHaze2Fill,
} from "react-icons/bs";

import { BiSolidLogOut } from "react-icons/bi";

import SideBarIcon from "./SidebarIcon";
import { useUserContext } from "../../context/UserContext";

const Sidebar = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  const { logout } = useUserContext();
  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="top-0 left-0 h-screen w-20 m-0 flex flex-col text-black border-r border-gray-900/10 shadow-lg">
      <SideBarIcon icon={<BsCloudHaze2Fill size="24" />} text="Home" />
      <hr className="sidebar-hr" />
      <SideBarIcon icon={<BsPlus size="32" />} text="Add Board +" />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <hr className="sidebar-hr" />
      <SideBarIcon
        icon={<BiSolidLogOut size="24" />}
        text="Logout"
        handleClick={handleLogoutClick}
      />
      {/* <SideBarIcon icon={<BsGearFill size="22" />} text="Setting" /> */}
    </div>
  );
};

export default Sidebar;
