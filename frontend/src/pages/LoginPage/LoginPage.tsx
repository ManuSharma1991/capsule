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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from '@mui/material/styles'; // Import styled

// Assuming you have your validation schema and type
import { loginSchema, type LoginFormData } from '../../lib/validators/authValidators';
import { dataService } from '../../services/data.service'; // Assuming this exists and has a login method
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store'; // Assuming this is your store's AppDispatch type
import { showSnackBar } from '../../store/slices/SnackBarSlice'; // Assuming this is your snackbar slice
import { loginSuccessful } from '../../store/slices/AuthSlice';


const FullPageBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column', // To stack form and copyright
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    padding: theme.spacing(2), // Add some padding for smaller screens
    boxSizing: 'border-box',
    overflow: 'auto', // Allow scrolling if content overflows on very small screens
}));

const FormPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2, // Slightly more rounded
    width: '100%',
    maxWidth: '400px', // Max width for the form card
    backgroundColor: theme.palette.background.paper, // Ensure paper background is distinct
}));


const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            empId: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        setServerError(null);
        try {
            const response = await dataService.login(data); // Make sure dataService.login is an async function returning a promise
            console.log('Login successful:', response);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Store token in localStorage
            }
            // Assuming response contains user data and token for a real app
            dispatch(loginSuccessful({
                isAuthenticated: true,
                user: response.data.user, // Adjust based on your actual response structure
                token: response.data.token, // Adjust based on your actual response structure
            }));
            dispatch(showSnackBar({ message: "Login Successful", severity: 'success', dismissDuration: 3000 }));
            navigate('/home'); // Or desired page after login, e.g., '/dashboard'
        } catch (error) { // It's good to type error if possible, e.g., AxiosError
            console.error('Login failed:', error);
            dispatch(showSnackBar({ message: "error", severity: 'error', dismissDuration: 5000 }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FullPageBackground>
            <FormPaper elevation={6}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ color: 'text.primary', mb: 2 }}>
                    Sign In
                </Typography>
                {serverError && !isSubmitting && ( // Only show serverError if not submitting (to avoid flicker if error clears on retry)
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
                                autoComplete="username"
                                autoFocus
                                error={!!errors.empId}
                                helperText={errors.empId?.message}
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
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, position: 'relative' }}
                        disabled={isLoading || isSubmitting}
                    >
                        Sign In
                        {(isLoading || isSubmitting) && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: (theme) => theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[800], // Adapts to button variant
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Button>
                    <Grid container justifyContent="space-between"> {/* Use space-between for links */}
                        <Grid>
                            <MuiLink component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: 'primary.main' }}>
                                Forgot password?
                            </MuiLink>
                        </Grid>
                        <Grid>
                            <MuiLink component={RouterLink} to="/register" variant="body2" sx={{ color: 'primary.main' }}>
                                {"Don't have an account? Sign Up"}
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

export default LoginPage;