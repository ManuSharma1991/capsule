import { type FC } from 'react';
import {
    Typography,
    CircularProgress,
    Paper,
    Alert,
    Button,
} from '@mui/material';
import { FullPageBackground } from './DashboardStyles';
import type { DashboardData } from '../../types/dashboard';

interface DashboardStatusDisplayProps {
    dashboardData: DashboardData | null;
    // Optional props for specific error display when passed from parent
    isLoading?: boolean;
    error?: string | null;
}

const DashboardStatusDisplay: FC<DashboardStatusDisplayProps> = ({ isLoading, error, dashboardData }) => {
    // This component is now primarily for initial full-page loading/error or no data.
    // Individual components will handle their own loading/error states.

    // If isLoading is explicitly true (e.g., initial app load)
    if (isLoading) {
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="inherit" size={60} />
                <Typography sx={{ color: 'white', mt: 2 }}>Loading Dashboard...</Typography>
            </FullPageBackground>
        );
    }

    // If error is explicitly provided (e.g., initial app load error)
    if (error) {
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Paper sx={{ p: 3, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h5" color="error" gutterBottom>Loading Error</Typography>
                    <Alert severity="error">{error}</Alert>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Try Again
                    </Button>
                </Paper>
            </FullPageBackground>
        );
    }

    // If no dashboard data is available after initial load
    if (!dashboardData) {
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>No data available.</Typography>
            </FullPageBackground>
        );
    }

    return null; // If none of the above, render nothing (main content will be rendered by parent)
};

export default DashboardStatusDisplay;
