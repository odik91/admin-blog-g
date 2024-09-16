import { PayloadAction } from "@reduxjs/toolkit";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCategoryThunk, getCategoryThunk } from "./categoryThunk";

export type CategoryData = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEditCategory = {
  name: string;
  description?: string;
};

type Link = {
  url: string | null;
  label: string;
  active: boolean;
};

export type BaseCategory = {
  current_page: number;
  data: CategoryData[];
  first_page_url: string | null;
  from: number | null;
  last_page: number | null;
  last_page_url: string | null;
  links: Link[] | null;
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type ResponseData = {
  message: string;
  categories: BaseCategory;
};

export type QueryCategory = {
  order?: string | null,
  search?: string | null;
  limit?: number | string;
  page?: number | string;
};

type InitialState = BaseCategory & {
  is_loading?: boolean;
};

const initialState: InitialState = {
  is_loading: false,
  current_page: 1,
  data: [],
  first_page_url: null,
  from: 1,
  last_page: 1,
  last_page_url: null,
  links: null,
  next_page_url: null,
  path: null,
  per_page: 10,
  prev_page_url: null,
  to: 10,
  total: 0,
};

export const createCategory = createAsyncThunk<
  CategoryData & { message: string },
  CreateEditCategory,
  { rejectValue: string; state: RootState }
>(
  "category/create",
  async (category: CreateEditCategory, thunkAPI): Promise<any> => {
    return createCategoryThunk("/category", category, thunkAPI);
  }
);

export const getCategory = createAsyncThunk<
  any,
  QueryCategory,
  { rejectValue: string; state: RootState }
>("category/getAll", async (queryCategory: QueryCategory, thunkAPI) => {
  return getCategoryThunk("/category", queryCategory, thunkAPI);
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.is_loading = action.payload as boolean;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.is_loading = true;
      })
      .addCase(
        createCategory.fulfilled,
        (
          state,
          { payload }: PayloadAction<CategoryData & { message: string }>
        ) => {
          state.is_loading = false;
          console.log(payload);
        }
      )
      .addCase(
        createCategory.rejected,
        (state, { payload }: PayloadAction<string | undefined>) => {
          state.is_loading = false;
          console.log(payload);
        }
      )
      .addCase(getCategory.pending, (state) => {
        state.is_loading = true;
      })
      .addCase(
        getCategory.fulfilled,
        (state, { payload }: PayloadAction<ResponseData>) => {
          const { categories } = payload;
          const {
            current_page,
            data,
            first_page_url,
            from,
            last_page,
            last_page_url,
            links,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total,
          } = categories;

          state.is_loading = false;
          state.current_page = current_page;
          state.data = data;
          state.first_page_url = first_page_url;
          state.from = from;
          state.last_page = last_page;
          state.last_page_url = last_page_url;
          state.links = links;
          state.next_page_url = next_page_url;
          state.path = path;
          state.per_page = per_page;
          state.prev_page_url = prev_page_url;
          state.to = to;
          state.total = total;
        }
      )
      .addCase(
        getCategory.rejected,
        (state, { payload }: PayloadAction<string | undefined>) => {
          state.is_loading = false;
          console.log(payload);
        }
      );
  },
});

export const { setLoading } = categorySlice.actions;

export default categorySlice.reducer;
