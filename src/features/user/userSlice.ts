import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { loginUserThunk } from "./userThunk";
import { RootState } from "@/store";
import { loginUserThunk } from "./userThunk";
import { addUserToLocalStorage } from "@/utils/localStorage";

export type UserType = {
  id: number;
  name: string;
  email: string;
  is_activate: number;
};

export type UserData = {
  data: UserType;
  token: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

type InitialState = {
  isLoading: boolean;
  user: UserData | null;
};

export interface ThunkAPI {
  rejectWithValue: (value: string) => void;
  dispatch: Function;
}

const initialState: InitialState = {
  isLoading: false,
  user: null,
};

export const errorHelperThunkAPI = (
  error: unknown,
  thunkAPI: ThunkAPI,
  actionType: "auth" | "action"
) => {
  if (axios.isAxiosError(error)) {
    if (actionType === "action") {
      if (error.response?.status === 401) {
        thunkAPI.dispatch(logoutUser());
        return thunkAPI.rejectWithValue("Unauthorized! Logging out...");
      }
    }

    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "An error occurred"
    );
  } else if (error instanceof Error) {
    return thunkAPI.rejectWithValue(error.message);
  } else {
    return thunkAPI.rejectWithValue("Unknown error occurred");
  }
};

export const loginUser = createAsyncThunk<
  UserData,
  LoginUser,
  { rejectValue: string; state: RootState }
>(
  "user/loginUser",
  async (user: LoginUser, thunkAPI: ThunkAPI): Promise<any> => {
    return loginUserThunk("/login", user, thunkAPI);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state, { payload }: PayloadAction<string | undefined>) => {
      state.user = null;
      console.log(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        loginUser.fulfilled,
        (state, { payload }: PayloadAction<UserData>) => {
          state.isLoading = false;
          state.user = payload;
          addUserToLocalStorage(payload)
        }
      )
      .addCase(
        loginUser.rejected,
        (state, { payload }: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          console.log(payload);
        }
      );
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
