import type { AlertColor } from '@mui/material';

export interface SnackBarStateTypes {
   dismissDuration?: number;
   severity: AlertColor;
   message: string;
}
