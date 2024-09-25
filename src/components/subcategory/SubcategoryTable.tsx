import { useGetSubcategories } from "@/actions/subcategory";
import { useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Button } from "../ui/button";

type GetCategory = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
};

export type Subcategory = {
  id: string;
  category_id: number;
  subcategory: string;
  slug: string;
  description: string;
  is_active: boolean | number;
  get_category?: GetCategory;
};

export type SubcategoryApiResponse = {
  data: Array<Subcategory>;
  meta: {
    totalRowCount: number;
  };
};

const SubcategoryTable = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // local state column filter
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState(
    searchParams.get("search") || ""
  );
  const [sorting, setSorting] = useState<MRT_SortingState>(() => {
    const sortParam = searchParams.get("sort");
    const descParam = searchParams.get("desc");
    if (sortParam) {
      return [{ id: sortParam, desc: descParam === "true" }];
    }
    return [];
  });
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: searchParams.get("page")
      ? Number(searchParams.get("page")) - 1
      : 0,
    pageSize: Number(searchParams.get("limit")) || 10,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [editedSubcategory, setEditedSubcategory] = useState<
    Record<string, Subcategory>
  >({});

  // define subcategory column
  const columns = useMemo<MRT_ColumnDef<Subcategory>[]>(
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
        accessorKey: "get_category",
        header: "Category",
        enableEditing: true,
        enableColumnFilter: true,
        Cell: ({ row }) => {
          return row.original.get_category?.name;
        },
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "text",
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = validateRequired(event.currentTarget.value)
              ? "Required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });

            setEditedSubcategory({
              ...editedSubcategory,
              [row.id]: row._valuesCache,
            });
          },
        }),
        muiTableBodyCellProps: ({ cell }) => {
          if (validationErrors[cell.id]) {
            return {
              style: {
                backgroundColor: "#f8d7da",
                color: "#721c24", // Teks warna merah jika ada error
                border: "1px dashed #bd0013",
              },
            };
          }
          return {
            style: {},
          };
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "text",
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = validateRequired(event.currentTarget.value)
              ? "Required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });

            setEditedSubcategory({
              ...editedSubcategory,
              [row.id]: row._valuesCache,
            });
          },
        }),
        muiTableBodyCellProps: ({ cell }) => {
          if (validationErrors[cell.id]) {
            return {
              style: {
                backgroundColor: "#f8d7da",
                color: "#721c24", // Teks warna merah jika ada error
                border: "1px dashed #bd0013",
              },
            };
          }
          return {
            style: {},
          };
        },
      },
    ],
    [
      pagination.pageIndex,
      pagination.pageSize,
      editedSubcategory,
      validationErrors,
    ]
  );

  const handleCreateSubcategory: MRT_TableOptions<Subcategory>["onCreatingRowSave"] =
    async ({ values, table }) => {
      console.log(values, table);
    };

  const handleSaveSubcategory = async () => {
    console.log("save subcategory");
  };

  const openDeleteSubcategoryConfirmModal = (row: MRT_Row<Subcategory>) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p>Warning!</p>,
      icon: "warning",
      html: `Are you sure want to delete<br><b>${row.original.subcategory}?</b>`,
      confirmButtonText: "Confirm",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Item deleted", "", "info");
      } else if (result.isDenied) {
        Swal.fire("Item not deleted", "", "info");
      }
    });
  };

  // call read subcategory data
  const {
    data: { data = [], meta } = {},
    isError: isLoadingSubcategoryError,
    isRefetching: isFetchingSubcategory,
    isLoading: isLoadingSubcategory,
  } = useGetSubcategories(columnFilters, globalFilter, pagination, sorting);

  const table = useMaterialReactTable({
    columns,
    data: data,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    createDisplayMode: "row",
    editDisplayMode: "cell",
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableColumnPinning: true,
    enableEditing: true,
    enableRowActions: true,
    enableGlobalFilter: true,
    getRowId: (row) => {
      return row?.id?.toString() || "0";
    },
    muiToolbarAlertBannerProps: isLoadingSubcategoryError
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
    onColumnFiltersChange: setColumnFilters,
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
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      const sortId = newSorting[0]?.id || "";
      const desc = newSorting[0]?.desc ? "true" : "false";

      // update the url parameters with new sorting
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        if (sortId) {
          // If sortId is not empty, update the 'sort' and 'desc' params
          newParams.set("sort", sortId);
          newParams.set("desc", desc);
        } else {
          // If sortId is empty, remove 'sort' and 'desc' params
          newParams.delete("sort");
          newParams.delete("desc");
        }
        return newParams;
      });

      // update the sorting state
      setSorting(newSorting);
    },
    onCreatingRowSave: handleCreateSubcategory,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => openDeleteSubcategoryConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="outline"
          onClick={handleSaveSubcategory}
          disabled={
            Object.keys(editedSubcategory).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {/* {is_loading ? <CircularProgress size={25} /> : "Save"} */}
          Save
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">
            Please check your input categroy and description before submitting
          </Typography>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="outline"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Add Subcategory
      </Button>
    ),
    initialState: {
      columnPinning: {
        right: ["mrt-row-actions"],
      },
      showColumnFilters: false,
      showGlobalFilter: searchParams.get("search") ? true : false,
    },
    state: {
      isLoading: isLoadingSubcategory,
      // isSaving: is_loading,
      showAlertBanner: isLoadingSubcategoryError,
      showProgressBars: isFetchingSubcategory,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

const validateRequired = (value: string) => !!value.length;

const validateSubcategory = (subcategory: Subcategory) => {
  return {
    subcategory: !validateRequired(subcategory.subcategory)
      ? "Subcategory is required"
      : "",
  };
};
export default SubcategoryTable;
