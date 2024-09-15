/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// import { loginUserThunk } from "./userThunk";
import { RootState } from "@/store";
import { loginUserThunk, logoutUserThunk } from "./userThunk";
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from "@/utils/localStorage";
import { toast } from "react-toastify";

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  dispatch: Function;
}

const initialState: InitialState = {
  isLoading: false,
  user: getUserFromLocalStorage(),
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

export const logoutUser = createAsyncThunk<any, void,  { rejectValue: string; state: RootState }>("user/logoutUser", async (_, thunkAPI: ThunkAPI) => {
  return logoutUserThunk('/logout', thunkAPI)
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {  },
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
          
          if (payload) toast.error(payload);
        }
      )
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        logoutUser.fulfilled,
        (state) => {
          state.isLoading = false;
          state.user = null;
          removeUserFromLocalStorage()
          toast.success('Logging out...')
        }
      )
      .addCase(
        logoutUser.rejected,
        (state, { payload }: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          if (payload) toast.error(payload);
        }
      )
  },
});

// export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
