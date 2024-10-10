import { logoutUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import { PostApiResponse, PostType } from "@/types/postType";
import customFetch from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MRT_PaginationState } from "material-react-table";
import Swal from "sweetalert2";

export const useAddPost = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: PostType) => {
      try {
        const formData = new FormData();
        formData.append("category_id", post.category_id);
        formData.append("subcategory_id", post.subcategory_id);
        formData.append("title", post.title);
        formData.append("meta_description", post.meta_description);
        formData.append("meta_keyword", post.meta_keyword);
        formData.append("seo_title", post.seo_title);
        formData.append("content", post.content);
        formData.append("is_active", post.is_active);

        if (post.image && post.image[0]) {
          formData.append("image", post.image[0]);
        }

        const response = await customFetch.post("/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          } else {
            // Handle other Axios errors (e.g., 400, 500)
            console.error("Error uploading post:", error.response?.data);
          }
        } else {
          console.error("Unexpected error:", error);
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};

export const useGetPosts = (
  globalFilter: string,
  pagination: MRT_PaginationState
) => {
  const dispatch = useAppDispatch();
  return useQuery<PostApiResponse | string | object>({
    queryKey: ["post", globalFilter, pagination],
    queryFn: async () => {
      const baseParams = `?limit=${pagination.pageSize}&page=${
        pagination.pageIndex + 1
      }${globalFilter ? `&search=${globalFilter}` : ""}`;

      try {
        const response = await customFetch.get(`/post${baseParams}`);
        const responseData: PostApiResponse = {
          data: response.data.data,
          meta: {
            totalRowCount: Number(response.data.total),
          },
        };

        return responseData;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }
          return error.response?.statusText || "Error";
        }
        return "Unknown error";
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // cache in 1 minute
  });
};

export const useGetSinglePost = (id: string) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      try {
        if (!id) return null;

        const response = await customFetch.get(`/post/${id}`);
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            dispatch(logoutUser());
          }

          // Menampilkan error dengan SweetAlert
          Swal.fire({
            title: "Error!",
            icon: "error",
            html: error.response?.statusText || "An error occurred",
          });

          // Return pesan error untuk bisa diakses di komponen
          return Promise.reject(
            error.response?.statusText || "Error fetching data"
          );
        }
        return Promise.reject("Unexpected error");
      }
    },
    enabled: id !== "",
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60, // cache in 1 minute
  });
};

export const useUpdatePost = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: PostType) => {
      try {
        const formData = new FormData();
        formData.append("category_id", post.category_id);
        formData.append("subcategory_id", post.subcategory_id);
        formData.append("title", post.title);
        formData.append("meta_description", post.meta_description);
        formData.append("meta_keyword", post.meta_keyword);
        formData.append("seo_title", post.seo_title);
        formData.append("content", post.content);
        formData.append("is_active", post.is_active);

        if (!post.oldImage) {
          formData.append("image", post.image[0]);
        }
        formData.append("_method", "PATCH");

        const response = await customFetch.post(`/post/${post.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
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
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};

export const useDeletePost = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await customFetch.delete(`/post/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
};
