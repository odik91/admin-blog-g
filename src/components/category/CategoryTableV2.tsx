import { useGetCategories } from "@/actions/category";
import {
  CategoryData,
  createCategory,
} from "@/features/category/categorySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/userCustomHook";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

export type CategoryApiResponse = {
  data: Array<CategoryData>;
  meta: {
    totalRowCount: number;
  };
};

const CategoryTableV2 = () => {
  const { is_loading } = useAppSelector((store) => store.category);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // local state
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
  //keep track of rows that have been edited
  const [editedCategory, setEditedCategory] = useState<
    Record<string, CategoryData>
  >({});

  const dispatch = useAppDispatch();

  // define columns
  const columns = useMemo<MRT_ColumnDef<CategoryData>[]>(
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
        accessorKey: "name",
        header: "Category",
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "text",
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? "Required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedCategory({ ...editedCategory, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "text",
          required: false,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? "Required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedCategory({ ...editedCategory, [row.id]: row.original });
          },
        }),
      },
    ],
    [
      editedCategory,
      validationErrors,
      pagination.pageIndex,
      pagination.pageSize,
    ]
  );

  const handleCreateCategory: MRT_TableOptions<CategoryData>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateCategory(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      const { name, description } = values;
      const data = { name, description };

      setValidationErrors({});
      await dispatch(createCategory(data));
      table.setCreatingRow(null);
      queryClient.invalidateQueries({ queryKey: ["category"] });
    };

  const handleSaveCategories = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;

    console.log(Object.values(editedCategory));
  };

  const openDeleteCategoryConfirmModal = (row: MRT_Row<CategoryData>) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log(row.original.id);
    }
  };

  // call read category data
  const {
    data: { data = [], meta } = {},
    isError: isLoadingCategoriesError,
    isRefetching: isFetchingCategories,
    isLoading: isLoadingCategories,
  } = useGetCategories(columnFilters, globalFilter, pagination, sorting);

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
    muiToolbarAlertBannerProps: isLoadingCategoriesError
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
    onCreatingRowSave: handleCreateCategory,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => openDeleteCategoryConfirmModal(row)}
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
          onClick={handleSaveCategories}
          disabled={
            Object.keys(editedCategory).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {is_loading ? <CircularProgress size={25} /> : "Save"}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
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
        Create category
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
      isLoading: isLoadingCategories,
      isSaving: is_loading,
      showAlertBanner: isLoadingCategoriesError,
      showProgressBars: isFetchingCategories,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

const validateRequired = (value: string) => !!value.length;

const validateCategory = (category: CategoryData) => {
  return {
    name: !validateRequired(category.name) ? "Category is required" : "",
  };
};

export default CategoryTableV2;
