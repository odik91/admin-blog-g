import { useGetCategoriesNonFiltering } from "@/hooks/actions/category";
import {
  useCreateSubcategory,
  useDeleteSubcategory,
  useGetSubcategories,
  useMassUpdateSubcategory,
} from "@/hooks/actions/subcategory";
import { CategoryForSelect } from "@/types/categoryTipe";
import { Subcategory } from "@/types/subcategoryType";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
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
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";

const actives = [
  {
    status: "inactive",
    value: 0,
  },
  {
    status: "active",
    value: 1,
  },
];

const SubcategoryTable = () => {
  // const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories } = useGetCategoriesNonFiltering();

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
        accessorKey: "category_id",
        header: "Category",
        enableEditing: true,
        enableColumnFilter: true,
        muiEditTextFieldProps: ({ cell, row }) => ({
          select: true,
          required: true,
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          children: categories.map((category: CategoryForSelect) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          )),
          onBlur: (event) => {
            const validationError = event.target.value
              ? undefined
              : "Category is required";
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
        Cell: ({ row }) => {
          // Menampilkan nama kategori di cell berdasarkan category_id
          const category = categories.find(
            (cat: { id: number }) => cat.id === row.original.category_id
          );
          return category ? category.name : "Unknown Category";
        },
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
        accessorKey: "subcategory",
        header: "Subcategory",
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: "text",
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = event.target.value
              ? undefined
              : "Subcategory is required";
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
          required: false,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = event.target.value
              ? undefined
              : "Description is required";
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
        accessorKey: "is_active",
        header: "Active",
        enableEditing: true,
        enableColumnFilter: true,
        muiEditTextFieldProps: ({ cell, row }) => ({
          select: true,
          required: true,
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          children: actives.map((active) => (
            <MenuItem key={active.value} value={active.value}>
              {active.status}
            </MenuItem>
          )),
          onBlur: (event) => {
            const validationError =
              event.target.value.toString() === "0" ||
              event.target.value.toString() === "1"
                ? undefined
                : "Select active is required";
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
        Cell: ({ row }) => {
          const filteredId = Object.values(editedSubcategory).filter(
            (item) => item.id === row.original.id
          );

          if (filteredId.length > 0) {
            return filteredId[0].is_active === 1 ? (
              <Badge
                variant="outline"
                className="text-white bg-green-500 px-3 py-2"
              >
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="px-3 py-2">
                Inactive
              </Badge>
            );
          }

          return row.original.is_active === 1 ? (
            <Badge
              variant="outline"
              className="text-white bg-green-500 px-3 py-2"
            >
              Active
            </Badge>
          ) : (
            <Badge variant="destructive" className="px-3 py-2">
              Inactive
            </Badge>
          );
        },
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
      categories,
    ]
  );

  // call create hook
  const { mutateAsync: createSubcategory, isPending: isCreatingSubcategory } =
    useCreateSubcategory();

  const {
    mutateAsync: updateSubcategories,
    isPending: isUpdatingSubcategories,
  } = useMassUpdateSubcategory();

  const { mutateAsync: deleteSubcategory, isPending: isDeletingSubcategory } =
    useDeleteSubcategory();

  const handleCreateSubcategory: MRT_TableOptions<Subcategory>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateSubcategory(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        Swal.fire({
          title: "Warning!",
          icon: "warning",
          html: `Please check again your input`,
        });
        return;
      }

      createSubcategory(values).then(() => {
        Swal.fire({
          title: "Success!",
          icon: "success",
          html: `Subcategory ${values.subcategory} added successfully`,
        });

        setValidationErrors({});
        table.setCreatingRow(null);
      });
    };

  const handleSaveSubcategory = async () => {
    if (Object.values(validationErrors).some((error) => error)) {
      setValidationErrors(validationErrors);
      Swal.fire({
        title: "Warning!",
        icon: "warning",
        html: `Please check again your input`,
      });
      return;
    }

    // const data: Subcategory = []
    updateSubcategories(Object.values(editedSubcategory)).then((res) => {
      if (res?.status === 200) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          html: res?.data.message,
        });
        setValidationErrors({});
        setEditedSubcategory({});
      } else {
        Swal.fire({
          title: "Error!",
          icon: "error",
          html: res?.data.message,
        });
      }
    });
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
      const id = row.original.id as string;
      if (result.isConfirmed) {
        deleteSubcategory(id).then((res) => {
          if (res?.status === 200) {
            Swal.fire({
              title: "Success!",
              icon: "success",
              html: res?.data.message,
            });
            setValidationErrors({});
            setEditedSubcategory({});
          } else {
            Swal.fire({
              title: "Error!",
              icon: "error",
              html: res?.data.message,
            });
          }
        });
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
    onColumnFiltersChange: (updater) => {
      const newColumnFilter =
        typeof updater === "function" ? updater(columnFilters) : updater;

      setSearchParams((prevParams) => {
        const findCategory = newColumnFilter.filter(
          (item) => item.id === "category_id"
        );

        const findSubcategory = newColumnFilter.filter(
          (item) => item.id === "subcategory"
        );

        const newSearchParams = new URLSearchParams(prevParams);

        if (findCategory.length > 0) {
          const cat_value = findCategory[0].value as string;
          newSearchParams.set("category_id", cat_value);
        } else {
          newSearchParams.delete("category_id");
        }

        if (findSubcategory.length > 0) {
          const subcat_value = findSubcategory[0].value as string;
          newSearchParams.set("subcategory", subcat_value);
        } else {
          newSearchParams.delete("subcategory");
        }

        return newSearchParams;
      });
      setColumnFilters(newColumnFilter);
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
          {isUpdatingSubcategories ? <CircularProgress size={25} /> : "Save"}
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
      isSaving:
        isCreatingSubcategory ||
        isUpdatingSubcategories ||
        isDeletingSubcategory,
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
    category_id: !subcategory.category_id ? "Category is required" : "",
    is_active: !subcategory.is_active ? "Is active is required" : "",
  };
};
export default SubcategoryTable;
