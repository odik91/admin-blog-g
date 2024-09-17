import { LoadingContent } from "@/components/generals";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryData, QueryCategory } from "@/features/category/categorySlice";
import customFetch from "@/utils/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Number(searchParams.get("page")) - 1 || 0,
    pageSize: Number(searchParams.get("limit")) || 10,
  });

  const [queryParameters, setQueryParameters] = useState<QueryCategory>({
    order: searchParams.get("order") || "asc",
    search: searchParams.get("search") || null,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1, // Convert back to 1-indexed for API
  });

  const columns = useMemo<ColumnDef<CategoryData>[]>(
    () => [
      {
        header: "No",
        cell: (info) => {
          let set_row: number = 0;
          if (Number(queryParameters.page) === 1) {
            set_row = 0;
          } else {
            set_row =
              Number(queryParameters.page) * Number(queryParameters.limit);
          }

          return info.row.index + 1 + set_row;
        },
      },
      {
        accessorKey: "name",
        header: "Category",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    [queryParameters.limit, queryParameters.page]
  );

  const categoryQuery = useQuery({
    queryKey: ["category", queryParameters],
    queryFn: async () => {
      const response = await customFetch.get(
        `/category?limit=${queryParameters.limit}${
          queryParameters.search ? `&search=${queryParameters.search}` : ""
        }&order=${queryParameters.order}&page=${queryParameters.page}`
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30, // data will invalidate in 3 minute
  });

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
    setSearchParams((prevParams) => {
      prevParams.set("page", page.toString()); // Update 'page' in URL
      return prevParams;
    });
    setQueryParameters((prevParams) => {
      prevParams.page = page;
      return prevParams;
    });
  };

  const tableData = categoryQuery.isSuccess
    ? categoryQuery.data.categories.data
    : [];
  const totalRecords = categoryQuery.isSuccess
    ? categoryQuery.data.categories.total
    : 0;

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil(totalRecords / pagination.pageSize),
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination, // This is where you directly use setPagination
    debugTable: false,
  });

  return (
    <div
      className="p-3 bg-gray-100 overflow-y-scroll overflow-x-hidden"
      style={{
        height: "calc(100vh - 150px)",
        minHeight: "calc(100vh - 150px)",
      }}
    >
      <BreadCrumb link="/" target="home" current="category" />
      <main className="m-2 p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <h1>Total Record: {totalRecords}</h1>
          <Button variant="outline">Add new category</Button>
        </div>
        <Separator className="my-3" />
        <div className="">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="text-center" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {categoryQuery.isFetching ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    <LoadingContent />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => handlePageChange(1)}
              disabled={pagination.pageIndex === 0}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => handlePageChange(pagination.pageIndex)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>

            {/* next button */}
            <button
              className="border rounded p-1"
              onClick={() => handlePageChange(pagination.pageIndex + 2)}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => handlePageChange(table.getPageCount())}
              disabled={pagination.pageIndex === table.getPageCount() - 1}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {queryParameters?.page || 1} of {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                // defaultValue={pagination.pageIndex + 1}
                value={queryParameters?.page || 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) : 1;
                  handlePageChange(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                const pageSize = Number(e.target.value);
                setPagination((prev) => ({ ...prev, pageSize }));
                setSearchParams((prevParams) => {
                  prevParams.set("limit", pageSize.toString()); // Update 'limit' in URL
                  return prevParams;
                });
                setQueryParameters((prevParams) => {
                  prevParams.limit = Number(e.target.value);
                  return prevParams;
                });
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;
