import { FaBars } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaGear } from "react-icons/fa6";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-3 w-full shadow-md shadow-gray-300 bg-slate-100 h-[75px]">
      <div>
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-900 hover:rotate-180 transition ease-in-out delay-100"
        >
          <FaBars className="text-3xl" />
        </Button>
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
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
export default Navbar;
