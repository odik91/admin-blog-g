import { useMemo, useState } from "react";
import { CategoryData } from "@/features/category/categorySlice";
import {
  MaterialReactTable,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useAppDispatch, useAppSelector } from "@/hooks/userCustomHook";
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/axios";
import axios from "axios";
import { logoutUser } from "@/features/user/userSlice";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import { Button } from "../ui/button";

const CategoryTableV2 = () => {
  const { is_loading } = useAppSelector((store) => store.category);
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
    [editedCategory, validationErrors]
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
    data: fetchedCategories = [],
    isError: isLoadingCategoriesError,
    isFetching: isFetchingCategories,
    isLoading: isLoadingCategories,
  } = useGetCategories();

  const table = useMaterialReactTable({
    columns,
    data: fetchedCategories,
    createDisplayMode: "row",
    editDisplayMode: "cell",
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableColumnPinning: true,
    enableEditing: true,
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="default"
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
    },
    state: {
      isLoading: isLoadingCategories,
      // isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingCategoriesError,
      showProgressBars: isFetchingCategories,
    },
  });

  return <MaterialReactTable table={table} />;
};

const useGetCategories = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const response = await customFetch.get(`/category`);
        return response.data.categories.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // data will invalidate in 3 minute
  });
};

const validateRequired = (value: string) => !!value.length;

const validateCategory = (category: CategoryData) => {
  return {
    name: !validateRequired(category.name) ? "Category is required" : "",
  };
};

export default CategoryTableV2;
