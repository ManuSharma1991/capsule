import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppStateTypes } from '../types/AppStateTypes';
import type { SnackBarStateTypes } from '../types/SnackBarStateTypes';

const initialState: SnackBarStateTypes = {
   dismissDuration: 5000,
   severity: 'error',
   message: '',
};

export const snackBarSlice = createSlice({
   name: 'snackBar',
   initialState,
   reducers: {
      showSnackBar: (state, action: PayloadAction<SnackBarStateTypes>) => {
         state.severity = action.payload.severity;
         state.message = action.payload.message;
         state.dismissDuration = action.payload.dismissDuration || 5000;
      },
      hideSnackBar: (state) => {
         state.message = '';
         state.dismissDuration = 5000;
      },
   },
   extraReducers() {
   },
});

export const { showSnackBar, hideSnackBar } = snackBarSlice.actions;

export default snackBarSlice.reducer;

export const selectSnackBar = (state: AppStateTypes) => state.snackBar;
