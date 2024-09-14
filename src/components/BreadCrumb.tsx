import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const BreadCrumb = ({
  link,
  target,
  current,
}: {
  link: string;
  target: string;
  current: string;
}) => {
  return (
    <header className="flex justify-between items-center p-3">
      <h1 className="font-semibold text-2xl capitalize">{current}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* <BreadcrumbLink>Home</BreadcrumbLink> */}
            <Link to={link} className="hover:text-gray-800 capitalize">
              {target}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">{current}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default BreadCrumb;
