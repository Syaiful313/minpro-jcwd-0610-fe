import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  fullName: string;
  email: string;
  token: string;
}

const initialState: UserState = {
  id: 0,
  fullName: "",
  email: "",
  token: "",
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    logoutAction: (state) => {
      state.id = 0;
      state.fullName = "";
      state.email = "";
      state.token = "";
    },
  },
});

export const { loginAction, logoutAction } = userReducer.actions;
export default userReducer.reducer;
