import { createTheme, Snackbar, ThemeProvider } from '@mui/material';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './router/Router';
import type { AppDispatch } from './store/store';
import { hideSnackBar, selectSnackBar } from './store/slices/SnackBarSlice';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
    palette: {
      primary: {
        main: '#1c2f39',
      },
    },
  });

  const snackBar = useSelector(selectSnackBar);

  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    dispatch(hideSnackBar());
  };

  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
      <Snackbar
        open={snackBar.message !== ''}
        autoHideDuration={snackBar.dismissDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ClickAwayListenerProps={{
          onClickAway() {
            return;
          },
        }}
      >
        <Alert onClose={handleClose} severity={snackBar.severity} sx={{ width: '100%' }}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
