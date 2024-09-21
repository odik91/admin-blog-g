import { useGetCategories } from "@/actions/category";
import { CategoryData } from "@/features/category/categorySlice";
import { useAppSelector } from "@/hooks/userCustomHook";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
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
import { Button } from "../ui/button";

export type CategoryApiResponse = {
  data: Array<CategoryData>;
  meta: {
    totalRowCount: number;
  };
};

const CategoryTableV2 = () => {
  const { is_loading } = useAppSelector((store) => store.category);

  // local state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedCategory, setEditedCategory] = useState<
    Record<string, CategoryData>
  >({});

  // define columns
  const columns = useMemo<MRT_ColumnDef<CategoryData>[]>(
    () => [
      {
        accessorKey: "id",
        header: "No",
        enableEditing: false,
        size: 30,
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
          },
        }),
      },
      {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
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
          },
        }),
      },
    ],
    [
      // editedCategory,
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
      console.log(values);
      table.setCreatingRow(null);
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
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
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
          onClick={() => {
            console.log("edit");
          }}
          // disabled={
          //   Object.keys(editedUsers).length === 0 ||
          //   Object.values(validationErrors).some((error) => !!error)
          // }
        >
          {/* {isUpdatingUsers ? <CircularProgress size={25} /> : "Save"} */}
          save
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     variant="default"
    //     onClick={() => {
    //       table.setCreatingRow(true);
    //     }}
    //   >
    //     Create category
    //   </Button>
    // ),
    initialState: {
      columnPinning: {
        right: ["mrt-row-actions"],
      },
      showColumnFilters: false,
    },
    state: {
      isLoading: isLoadingCategories,
      // isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
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
