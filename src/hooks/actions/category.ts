import { logoutUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import { CategoryForSelect } from "@/types/categoryTipe";
import customFetch from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";

export const useGetCategories = (
  columnFilters: MRT_ColumnFiltersState,
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState
) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: [
      "category",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      let sortingParam: string = "";
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        sortingParam = `&orderBy=${id}&order=${desc ? "desc" : "asc"}`;
      }

      let columnFilter = "";
      if (columnFilters.length > 0) {
        const { id, value } = columnFilters[0];
        columnFilter = `&searchData=${id}&value=${value}`;
      }

      const params = `?limit=${pagination.pageSize}&page=${
        pagination.pageIndex + 1
      }${globalFilter ? `&search=${globalFilter}` : ""}${
        sortingParam && sortingParam
      }${columnFilter && columnFilter}`;

      try {
        const response = await customFetch.get(`/category${params}`);
        return {
          data: response.data.categories.data,
          meta: { totalRowCount: Number(response.data.categories.total) },
        };
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

export const useGetCategoriesNonFiltering = () => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["select-category"],
    queryFn: async () => {
      try {
        const response = await customFetch.get(`/category/non-sort`);
        return response.data.map((category: CategoryForSelect) => ({
          label: category.name,
          value: category.id,
        }));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
        }
        return error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // data will invalidate in 3 minute
  });
};
