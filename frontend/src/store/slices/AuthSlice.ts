import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthStateTypes } from "../types/AuthStateTypes";

const initialState: AuthStateTypes = {
    isAuthenticated: false,
    user: {
        empId: '',
        email: '',
        name: '',
    },
    token: '',
};

export const AuthSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        loginSuccessful: (state, action: PayloadAction<AuthStateTypes>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                empId: '',
                email: '',
                name: '',
            };
            state.token = '';
        },
    },
    extraReducers() {
    },
});

export const { loginSuccessful, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
