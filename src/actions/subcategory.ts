import { logoutUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import { Subcategory, SubcategoryApiResponse } from "@/types/subcategoryType";
import customFetch from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";

import { v4 as uuid } from "uuid";

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
      let columnParams = "";
      columnFilters.forEach((item) => {
        const { id, value } = item;
        columnParams += `&${id}=${value}`;
      });

      let sortingParam: string = "";
      if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        sortingParam = `&orderBy=${id}&order=${desc ? "desc" : "asc"}`;
      }

      const params = `?limit=${pagination.pageSize}&page=${
        pagination.pageIndex + 1
      }${
        globalFilter ? `&search=${globalFilter}` : ""
      }${columnParams}${sortingParam}`;

      try {
        const response = await customFetch.get(`/subcategory${params}`);

        const responseData = {
          data: response.data.data,
          meta: {
            totalRowCount: Number(response.data.total),
          },
        };

        return responseData;
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

export const useCreateSubcategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subcategory: Subcategory) => {
      try {
        await customFetch.post("/subcategory", subcategory);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
        }
      }
    },
    onMutate: async (subcategory: Subcategory) => {
      // Membatalkan refetch agar tidak menimpa perubahan optimistik
      await queryClient.cancelQueries({ queryKey: ["subcategory"] });

      // snapshoot the previous value
      const previousSubcategory =
        queryClient.getQueryData<SubcategoryApiResponse>(["subcategory"]);

      // Menambahkan ID sementara untuk subkategori baru
      subcategory.id = uuid();

      // Update data optimistik
      if (previousSubcategory) {
        queryClient.setQueryData<SubcategoryApiResponse>(["subcategory"], {
          ...previousSubcategory,
          data: [...previousSubcategory.data, subcategory],
        });

        // Mengembalikan data snapshot sebelumnya
        return { previousSubcategory };
      }
    },
    // Mengembalikan state ke keadaan sebelumnya jika terjadi kesalahan
    onError: (_error, _subcategory, context) => {
      if (context?.previousSubcategory) {
        queryClient.setQueryData<SubcategoryApiResponse>(
          ["subcategory"],
          context.previousSubcategory
        );
      }
    },
    // Invalidasi query setelah mutasi selesai atau error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
  });
};

export const useMassUpdateSubcategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subcategories: Subcategory[]) => {
      try {
        const response = await customFetch.patch("/subcategory", subcategories);
        return response;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
          return error.response;
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
  });
};

export const useDeleteSubcategory = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await customFetch.delete(`/subcategory/${id}`);
        return response;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
          return error.response;
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategory"] });
    },
  });
};
