import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: null,
    email: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log('Login success action', action);
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.email = null;
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.newToken;
    },
  },
});

export const { loginSuccess, logoutSuccess, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;
