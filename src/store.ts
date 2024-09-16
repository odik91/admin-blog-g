import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./features/sidebar/sidebarSlice";
import userReducer from "./features/user/userSlice";
import categoryReducer from "./features/category/categorySlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userReducer,
    category: categoryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
