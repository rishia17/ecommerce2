import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userLoginThunk = createAsyncThunk('userLogin', async (userCred, thunkApi) => {
  try {
    let res;
    if (userCred.userType === 'user') {
      res = await axios.post('http://localhost:5500/user-api/login', userCred);
    } else if (userCred.userType === 'admin') {
      res = await axios.post('http://localhost:5500/admin-api/login', userCred);
    }

    if (res.data.message === 'login success') {
      sessionStorage.setItem('token', res.data.token);
      return res.data;
    } else {
      return thunkApi.rejectWithValue(res.data.message);
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const userLoginSlice = createSlice({
  name: 'user-login-slice',
  initialState: {
    isPending: false,
    currentUser: {},
    errorStatus: false,
    errorMessage: '',
    loginStatus: false,
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.currentUser = {};
      state.errorStatus = false;
      state.errorMessage = '';
      state.loginStatus = false;
    },
    updateCartCount: (state, action) => {
      if (state.currentUser.cart) {
        state.currentUser.cart = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentUser = action.payload.user;
        state.errorStatus = false;
        state.errorMessage = '';
        state.loginStatus = true;
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = {};
        state.errorStatus = true;
        state.errorMessage = action.payload;
        state.loginStatus = false;
      });
  },
});

export const { resetState, updateCartCount } = userLoginSlice.actions;
export default userLoginSlice.reducer;
