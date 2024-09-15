import { UserData } from "../features/user/userSlice";

export const addUserToLocalStorage = (user: UserData): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem("user");
};

export const getUserFromLocalStorage = (): UserData | null => {
  const result = localStorage.getItem("user");
  const user: UserData | null = result ? JSON.parse(result) : null;
  return user;
};
