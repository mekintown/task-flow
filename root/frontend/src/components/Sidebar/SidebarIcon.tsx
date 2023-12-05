import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text?: string;
  handleClick?: () => void;
}

const SideBarIcon = ({
  icon,
  text = "Untitled💡",
  handleClick = () => {
    return;
  },
}: Props) => (
  <div className="sidebar-icon group" onClick={() => handleClick()}>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

export default SideBarIcon;
