import { RootState } from "@/store";
import {
  errorHelperThunkAPI,
  LoginUser,
  ThunkAPI,
  UserData,
} from "./userSlice";
import customFetch from "@/utils/axios";

export interface AppThunkAPI extends ThunkAPI {
  getState: () => RootState;
}

export const loginUserThunk = async (
  url: string,
  user: LoginUser,
  thunkAPI: ThunkAPI
): Promise<UserData | ReturnType<ThunkAPI["rejectWithValue"]>> => {
  try {
    const response = await customFetch.post(url, user);
    return response.data;
  } catch (error: unknown) {
    return errorHelperThunkAPI(error, thunkAPI, "auth");
  }
};

export const logoutUserThunk = async (url: string, thunkAPI: ThunkAPI) => {
  try {
    const response = await customFetch.post(url);    
    return response.data;
  } catch (error: unknown) {
    return errorHelperThunkAPI(error, thunkAPI, "auth");
  }
};
