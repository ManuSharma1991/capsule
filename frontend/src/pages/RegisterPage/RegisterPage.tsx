import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Link as MuiLink,
    Paper,
    Avatar,
    CircularProgress,
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from '@mui/material/styles';

// Validation schema and type for registration
import { registerSchema, type RegisterFormData } from '../../lib/validators/authValidators';
import { dataService } from '../../services/data.service'; // Assuming this exists and has a register method
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { showSnackBar } from '../../store/slices/SnackBarSlice';
import { AxiosError } from 'axios';
import { AUTH_ERROR_CODES, AUTH_ERROR_MESSAGES } from '../../lib/constants/errors';
import type { BackendErrorResponse } from '../../types/backendErrorResponse';
// import { registrationSuccessful } from '../../store/slices/AuthSlice'; // You might want a specific action for registration

// Styled components (can be shared or defined per page if different)
const FullPageBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,  // Using secondary color for differentiation
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    overflow: 'auto',
}));

const FormPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    width: '100%',
    maxWidth: '450px', // Slightly wider for more fields
    backgroundColor: theme.palette.background.paper,
}));


const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null); // For displaying server-side errors
    const dispatch = useDispatch<AppDispatch>();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            empId: '',
            email: '',
            name: '',
            password: '',
            retypePassword: '',
        },
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            // Destructure retypePassword as it's usually not sent to the backend
            const { retypePassword, ...registrationData } = data;
            console.log(retypePassword)
            const response = await dataService.register(registrationData); // Make sure dataService.register exists
            console.log('Registration successful:', response);

            // Handle successful registration (e.g., show success message, redirect to login or auto-login)
            dispatch(showSnackBar({ message: "Registration Successful! Please login.", severity: 'success', dismissDuration: 5000 }));
            // Optionally, dispatch an action like registrationSuccessful if needed
            // dispatch(registrationSuccessful({ user: response.data.user })); // Adjust based on response
            navigate('/login');
        } catch (error: unknown) { // Use 'unknown' for catch clause variable type
            console.error('Registration failed:', error);
            let displayMessage = AUTH_ERROR_MESSAGES.DEFAULT; // Default error message

            // Type guard to check if it's an AxiosError and has the expected data structure
            if (error instanceof AxiosError && error.response && error.response.data && typeof error.response.data === 'object') {
                const backendError = error.response.data as Partial<BackendErrorResponse>; // Assert to your expected structure

                if (backendError.errorCode && backendError.errorCode in AUTH_ERROR_MESSAGES) {
                    displayMessage = AUTH_ERROR_MESSAGES[backendError.errorCode];
                } else if (backendError.message) {
                    displayMessage = backendError.message; // Use backend's message if no specific code maps
                }
                // You could also set serverError state here if needed for UI display beyond snackbar
                // setServerError(displayMessage);

            } else if (error instanceof Error) {
                // Handle standard JavaScript errors (e.g., network issues not caught by Axios as AxiosError with response)
                if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
                    displayMessage = AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.NETWORK_ERROR];
                } else {
                    displayMessage = error.message; // Or a generic unexpected error message
                }
                // setServerError(displayMessage);
            } else {
                // Error is not an Error instance (e.g., a string was thrown)
                console.error('An non-error was thrown:', error);
                // displayMessage is already AUTH_ERROR_MESSAGES.DEFAULT
                // setServerError(displayMessage);
            }

            dispatch(showSnackBar({ message: displayMessage, severity: 'error', dismissDuration: 5000 }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FullPageBackground>
            <FormPaper elevation={6}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <PersonAddOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ color: 'text.primary', mb: 2 }}>
                    Sign Up
                </Typography>
                {serverError && (
                    <Typography color="error" variant="body2" sx={{ mb: 2, width: '100%', textAlign: 'center' }}>
                        {serverError}
                    </Typography>
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ mt: 1, width: '100%' }}
                >
                    <Controller
                        name="empId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="empId"
                                label="Employee ID (e.g., U123456)"
                                autoComplete="username" // or "off" if preferred
                                autoFocus
                                error={!!errors.empId}
                                helperText={errors.empId?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                autoComplete="name"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                autoComplete="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Controller
                        name="retypePassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                name="retypePassword"
                                label="Retype Password"
                                type="password"
                                id="retypePassword"
                                autoComplete="new-password"
                                error={!!errors.retypePassword}
                                helperText={errors.retypePassword?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary" // Using secondary color for differentiation
                        sx={{ mt: 3, mb: 2, position: 'relative' }}
                        disabled={isLoading || isSubmitting}
                    >
                        Sign Up
                        {(isLoading || isSubmitting) && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[800],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <MuiLink component={RouterLink} to="/login" variant="body2" sx={{ color: 'secondary.main' }}>
                                Already have an account? Sign In
                            </MuiLink>
                        </Grid>
                    </Grid>
                </Box>
            </FormPaper>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3 }}>
                {'ITAT Case Management System © '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </FullPageBackground>
    );
};

export default RegisterPage;