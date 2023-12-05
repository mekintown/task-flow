import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  text?: string;
}

const SideBarIcon = ({ icon, text = "Untitled💡" }: Props) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

export default SideBarIcon;
