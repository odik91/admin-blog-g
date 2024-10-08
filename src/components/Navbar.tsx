import { toggleSidebar } from "@/features/sidebar/sidebarSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import { FaBars } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logoutUser } from "@/features/user/userSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const toggle = (): void => {
    dispatch(toggleSidebar());
  };

  const loggingOut = (): void => {
    dispatch(logoutUser());
  };

  return (
    <nav className="flex items-center justify-between p-3 w-full shadow-md shadow-gray-300 h-[75px]">
      <div className="px-3">
        <div
          className={`text-gray-500 active:opacity-0 active: hover:cursor-pointer hover:text-gray-900 hover:rotate-180 transition ease-in-out`}
          onClick={toggle}
        >
          <FaBars className="text-3xl" />
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 hover:rotate-180 transition ease-in-out delay-100"
            >
              <FaGear className="text-2xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 ml-2">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={loggingOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
export default Navbar;
