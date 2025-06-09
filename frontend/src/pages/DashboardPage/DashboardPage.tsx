import { useState, useEffect } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { AxiosError } from 'axios';

import { fetchDashboardData } from '../../lib/mock/dashboardMock';
import type { DashboardData } from '../../types/dashboard';
import type { BackendErrorResponse } from '../../types/backendErrorResponse';

import { FullPageBackground, Main, DrawerHeader } from '../../components/DashboardComponents/DashboardStyles';
import DashboardAppBar from '../../components/DashboardComponents/DashboardAppBar';
import DashboardDrawer from '../../components/DashboardComponents/DashboardDrawer';
import DashboardCardsSection from '../../components/DashboardComponents/DashboardCardsSection';
import DashboardCasesTable from '../../components/DashboardComponents/DashboardCasesTable';
import DateFilmstripCalendar from '../../components/DashboardComponents/DateFilmstripCalendar';
import DashboardStatusDisplay from '../../components/DashboardComponents/DashboardStatusDisplay';
import DashboardFooter from '../../components/DashboardComponents/DashboardFooter';


// --- Main Dashboard Page Component ---
const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile); // Open by default on desktop

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(''); // State for month dropdown
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // New state for selected date

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchDashboardData();
                setDashboardData(data);
                setSelectedMonth(data.selectedMonth);
            } catch (err: unknown) {
                console.error("Failed to load dashboard data:", err);
                let displayMessage = "An unexpected error occurred.";
                if (err instanceof AxiosError && err.response && err.response.data && typeof err.response.data === 'object') {
                    const backendError = err.response.data as Partial<BackendErrorResponse>;
                    displayMessage = backendError.message || "Server error fetching data.";
                } else if (err instanceof Error) {
                    displayMessage = err.message;
                }
                setError(displayMessage);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        setDrawerOpen(!isMobile);
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleRowToggleExpand = (rowId: string) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    return (
        <FullPageBackground>
            <Box sx={{ display: 'flex' }}>
                <DashboardAppBar
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />

                <DashboardDrawer
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />

                <Main open={drawerOpen}>
                    <DrawerHeader />

                    <DashboardStatusDisplay
                        isLoading={isLoading}
                        error={error}
                        dashboardData={dashboardData}
                    />

                    {dashboardData && (
                        <>
                            <DateFilmstripCalendar
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box mt={2}> {/* Add some margin between calendar and cards */}
                                        <DashboardCardsSection
                                            dashboardData={dashboardData}
                                            selectedMonth={selectedMonth}
                                            setSelectedMonth={setSelectedMonth}
                                            setDashboardData={setDashboardData}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <DashboardCasesTable
                                        cases={dashboardData.cases}
                                        expandedRowId={expandedRowId}
                                        handleRowToggleExpand={handleRowToggleExpand}
                                        selectedDate={selectedDate}
                                    />
                                </Box>
                            </Box>
                        </>
                    )}
                    <DashboardFooter />
                </Main>
            </Box>
        </FullPageBackground>
    );
};

export default DashboardPage;
