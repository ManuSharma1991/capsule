import { configureStore } from '@reduxjs/toolkit';
import SnackBarSlice from './slices/SnackBarSlice';
import AuthSlice from './slices/AuthSlice';

const store = configureStore({
    reducer: {
        snackBar: SnackBarSlice,
        authSlice: AuthSlice
    },
});

export type AppDispatch = typeof store.dispatch;

export default store;
