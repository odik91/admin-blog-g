import { useGetPosts } from "@/hooks/actions/post";
import { PostApiResponse, PostMainData } from "@/types/postType";
import { MoreHorizontal } from "lucide-react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { api_url } from "@/utils/axios";

const PostTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState(
    searchParams.get("search") || ""
  );
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: searchParams.get("page")
      ? Number(searchParams.get("page")) - 1
      : 0,
    pageSize: Number(searchParams.get("limit")) || 10,
  });

  const navigate = useNavigate()

  // define post column
  const columns = useMemo<MRT_ColumnDef<PostMainData>[]>(
    () => [
      {
        accessorKey: "id",
        header: "No",
        enableEditing: false,
        enableColumnFilter: false,
        size: 10,
        Cell: ({ row }) => {
          return row.index + 1 + pagination.pageIndex * pagination.pageSize;
        },
      },
      {
        accessorKey: "image",
        header: "Thumbnail",
        enableEditing: false,
        enableColumnFilter: true,
        Cell: ({ row }) => {
          return (
            <img
              src={api_url + row.original.image}
              alt={`${row.original.slug}-image`}
              className="w-24 border rounded-md shadow-md"
            />
          );
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        enableEditing: false,
        enableColumnFilter: true,
      },
      {
        accessorKey: "get_category.name",
        header: "Category",
        enableEditing: false,
        enableColumnFilter: true,
      },
      {
        accessorKey: "get_subcategory.subcategory",
        header: "Subcategory",
        enableEditing: false,
        enableColumnFilter: true,
      },
      {
        accessorKey: "content",
        header: "Content",
        enableEditing: false,
        enableColumnFilter: true,
        Cell: ({ row }) => {
          const parser = new DOMParser();
          const parserDocument = parser.parseFromString(
            row.original.content,
            "text/html"
          );
          const plainText = parserDocument.body.textContent || "";
          const truncatedText = plainText.slice(0, 150);

          return <p>{truncatedText}...</p>;
        },
      },
      {
        accessorKey: "get_user.name",
        header: "Author",
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "is_active",
        header: "Active",
        enableEditing: false,
        enableColumnFilter: true,
        Cell: ({ row }) => {
          return row.original.is_active === 1 ? (
            <Badge variant="outline" className="bg-green-600 text-white">
              Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-600 text-white">
              Inactive
            </Badge>
          );
        },
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  const {
    data = {},
    isError: isLoadingPostError,
    isRefetching: isFetchPost,
    isLoading: isLoadingPost,
  } = useGetPosts(globalFilter, pagination);

  const mainData = data as PostApiResponse;
  const tableData = mainData?.data ?? []; // Access 'data' safely
  const meta = mainData?.meta ?? { totalRowCount: 0 };

  const table = useMaterialReactTable({ 
    columns,
    data: tableData,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableCellActions: false,
    enableClickToCopy: "context-menu",
    enableColumnPinning: true,
    enableEditing: true,
    enableRowActions: true,
    enableGlobalFilter: true,
    getRowId: (row) => {
      return row?.id?.toString() || "0";
    },
    muiToolbarAlertBannerProps: isLoadingPostError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onGlobalFilterChange: (updater) => {
      setSearchParams((prevParams) => {
        const newSearchParams = new URLSearchParams(prevParams);
        if (updater) {
          newSearchParams.set("search", updater);
        } else {
          newSearchParams.delete("search", updater);
        }
        return newSearchParams;
      });

      setGlobalFilter(updater);
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("page", (newPagination.pageIndex + 1).toString());
        newParams.set("limit", newPagination.pageSize.toString());

        return newParams;
      });

      setPagination(newPagination);
    },
    renderRowActions: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex justify-start items-center gap-3 cursor-pointer"
            onClick={() => navigate(`${row.original.id}`)}
          >
            <IoEyeOutline className="text-xl" /> <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-start items-center gap-3 cursor-pointer"
            onClick={() => {
              console.log("delete");
            }}
          >
            <IoTrashOutline className="text-xl" /> <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    initialState: {
      columnPinning: {
        right: ["mrt-row-actions"],
      },
      showColumnFilters: false,
      showGlobalFilter: searchParams.get("search") ? true : false,
    },
    state: {
      isLoading: isLoadingPost,
      // isSaving:
      //   isCreatingSubcategory ||
      //   isUpdatingSubcategories ||
      //   isDeletingSubcategory,
      showAlertBanner: isLoadingPostError,
      showProgressBars: isFetchPost,
      // columnFilters,
      globalFilter,
      pagination,
      // sorting,
    },
  });

  return (
    <div className="mt-3">
      <MaterialReactTable table={table} />
    </div>
  );
};
export default PostTable;
