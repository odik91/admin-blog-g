import {
  FaAddressCard,
  FaComment,
  FaGalacticRepublic,
  FaNewspaper,
  FaScroll,
  FaUniversalAccess,
} from "react-icons/fa";
import SideLink from "./SideLink";
import { Separator } from "./ui/separator";
import { FaBookAtlas, FaMessage, FaUsersBetweenLines } from "react-icons/fa6";

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
  return (
    <aside className="hidden lg:block p-4 bg-zinc-700 w-[250px] h-screen text-white">
      <div className="flex items-center gap-2 mb-3">
        <img
          src="http://blogcms.siodik.my.id/template/dist/img/AdminLTELogo.png"
          alt="logo"
          className="w-[40px] h-[40px]"
        />
        <h1 className="text-2xl font-semibold">Admin Blog</h1>
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
