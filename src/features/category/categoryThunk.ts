import customFetch from "@/utils/axios";
import { errorHelperThunkAPI } from "../user/userSlice";
import { AppThunkAPI } from "../user/userThunk";
import {
  CategoryData,
  CreateEditCategory,
  QueryCategory,
} from "./categorySlice";

export const createCategoryThunk = async (
  url: string,
  category: CreateEditCategory,
  thunkAPI: AppThunkAPI
): Promise<(CategoryData & { message: string }) | unknown> => {
  try {
    const response = await customFetch.post(url, category);
    return response.data;
  } catch (error: unknown) {
    return errorHelperThunkAPI(error, thunkAPI, "action");
  }
};

export const getCategoryThunk = async (
  url: string,
  queryCategory: QueryCategory = {},
  thunkAPI: AppThunkAPI
) => {
  console.log(queryCategory);
  
  try {
    const response = await customFetch.get(url);

    return response.data;
  } catch (error: unknown) {
    return errorHelperThunkAPI(error, thunkAPI, "action");
  }
};
