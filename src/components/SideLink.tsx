import { useAppSelector } from "@/hooks/userCustomHook";
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
  const { sidebarOpen } = useAppSelector((store) => store.sidebar);
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        isActive
          ? "text-white rounded-md px-3 py-2 block bg-neutral-800"
          : "text-white hover:bg-neutral-800 hover:rounded-md px-3 py-2 block"
      }
    >
      <div
        className={`flex justify-start items-center ${
          sidebarOpen ? "gap-3 lg:gap-0" : "lg:gap-3"
        }`}
      >
        {icon}
        {/* <span className={`capitalize`}>{text}</span> */}
        <span
          className={`capitalize transform transition-all duration-300  ${
            sidebarOpen
              ? "w-full lg:w-0 lg:scale-0"
              : "w-0 lg:w-full lg:scale-100"
          }`}
        >
          {text}
        </span>
      </div>
    </NavLink>
  );
};
export default SideLink;
