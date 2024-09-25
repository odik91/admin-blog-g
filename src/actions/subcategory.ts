import { logoutUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import customFetch from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";

export const useGetSubcategories = (
  columnFilters: MRT_ColumnFiltersState,
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState
) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: [
      "subcategory",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const params = `?limit=${pagination.pageSize}&page=${
        pagination.pageIndex + 1
      }`

      console.log(columnFilters);
      
      try {
        const response = await customFetch.get(
          `/subcategory${params}`
        );

        const responseData = {
          data: response.data.data,
          meta: {
            totalRowCount: Number(response.data.total),
          },
        }       

        return responseData
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
        }
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};
