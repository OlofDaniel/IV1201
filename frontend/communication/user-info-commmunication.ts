import { createAsyncThunk } from "@reduxjs/toolkit";

interface UserInfoResponse {
  username: string;
  name: string;
  surname: string;
  email: string;
  pnr: string;
}

interface GetInfoError {
  message: string;
  errors?: { [key: string]: string };
}
const getUserInfo = async () => {
  const response = await fetch("http://127.0.0.1:8000/getinfo", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw {
      status: response.status,
      detail: data.detail,
    };
  }

  return data;
};
export const getUserInfoThunk = createAsyncThunk<
  UserInfoResponse,
  void,
  { rejectValue: GetInfoError }
>("user/getUserInfo", async (_, thunkAPI) => {
  try {
    const data = await getUserInfo();
    return data;
  } catch (error: any) {
    if (error.status == "409") {
      return thunkAPI.rejectWithValue(error.detail);
    }
    return thunkAPI.rejectWithValue({
      message: "Something went wrong, try again later",
    });
  }
});
