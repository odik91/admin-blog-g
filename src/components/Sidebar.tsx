import {
  FaAddressCard,
  FaBars,
  FaComment,
  FaGalacticRepublic,
  FaNewspaper,
  FaScroll,
  FaUniversalAccess,
} from "react-icons/fa";
import SideLink from "./SideLink";
import { Separator } from "./ui/separator";
import { FaBookAtlas, FaMessage, FaUsersBetweenLines } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/hooks/userCustomHook";
import { Button } from "./ui/button";
import { toggleSidebar } from "@/features/sidebar/sidebarSlice";

type Menu = {
  id: number;
  text: string;
  link: string;
  icon: React.ReactNode;
};

const menus: Menu[] = [
  {
    id: 1,
    text: "dashboard",
    link: "/",
    icon: <FaGalacticRepublic className="text-xl" />,
  },
  {
    id: 2,
    text: "category",
    link: "/category",
    icon: <FaBookAtlas className="text-xl" />,
  },
  {
    id: 3,
    text: "subcategory",
    link: "/subcategory",
    icon: <FaScroll className="text-xl" />,
  },
  {
    id: 4,
    text: "post",
    link: "/post",
    icon: <FaNewspaper className="text-xl" />,
  },
  {
    id: 5,
    text: "role",
    link: "/role",
    icon: <FaAddressCard className="text-xl" />,
  },
  {
    id: 6,
    text: "user",
    link: "/user",
    icon: <FaUsersBetweenLines className="text-xl" />,
  },
  {
    id: 7,
    text: "permission",
    link: "/permission",
    icon: <FaUniversalAccess className="text-xl" />,
  },
  {
    id: 8,
    text: "message",
    link: "/message",
    icon: <FaMessage className="text-xl" />,
  },
  {
    id: 9,
    text: "comment",
    link: "/comment",
    icon: <FaComment className="text-xl" />,
  },
];

const Sidebar = () => {
  const { sidebarOpen } = useAppSelector((store) => store.sidebar);
  const dispatch = useAppDispatch();

  const toggle = (): void => {
    dispatch(toggleSidebar());
  };
  return (
    <aside
      className={`lg:block p-4 bg-zinc-700 h-screen text-white transform transition-all w-[250px] ${
        sidebarOpen
          ? "lg:w-[75px] overflow-hidden fixed lg:relative"
          : "lg:w-[250px] hidden"
      }`}
    >
      <div className="flex items-center gap-2 mb-3 h-[45px] overflow-hidden relative">
        <img
          src="http://blogcms.siodik.my.id/template/dist/img/AdminLTELogo.png"
          alt="logo"
          className="w-[40px] h-[40px]"
        />
        {/* <h1 className="text-2xl font-semibold">Admin Blog</h1> */}
        <h1
          className={`${
            sidebarOpen ? "lg:scale-0" : "text-2xl font-semibold lg:scale-100"
          } transform transition-all duration-300 ease-in-out`}
        >
          Admin Blog
        </h1>
        <div className="absolute right-0">
          <Button
            variant="ghost"
            className="text-gray-500 lg:hidden"
            onClick={toggle}
          >
            <FaBars className="text-3xl" />
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <ul className="flex flex-col flex-wrap list-none my-4">
        {menus.map((menu) => {
          return (
            <li className="font-medium text-lg mb-2">
              <SideLink key={menu.id} {...menu} />
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
export default Sidebar;
