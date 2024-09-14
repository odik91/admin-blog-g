import { NavLink } from "react-router-dom";

const SideLink = ({
  link,
  icon,
  text,
}: {
  link: string;
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        isActive
          ? "text-white rounded-md px-3 py-2 block bg-neutral-800"
          : "text-white hover:bg-neutral-800 hover:rounded-md px-3 py-2 block"
      }
    >
      <div className="flex justify-start items-center gap-3">
        {icon}
        <span className="capitalize">{text}</span>
      </div>
    </NavLink>
  );
};
export default SideLink;
