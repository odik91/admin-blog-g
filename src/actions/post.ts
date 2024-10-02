import { logoutUser } from "@/features/user/userSlice";
import { useAppDispatch } from "@/hooks/userCustomHook";
import { PostType } from "@/types/postType";
import customFetch from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
