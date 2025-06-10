import { useState, useEffect } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { AxiosError } from 'axios'; // Import AxiosError as a value
import type { AxiosResponse } from 'axios'; // Import AxiosResponse as a type

import { dataService } from '../../services/data.service'; // Import dataService
import type { DashboardData, MainTableRowData } from '../../types/dashboard'; // Import MainTableRowData
import type { BackendErrorResponse } from '../../types/backendErrorResponse';
import { fetchDashboardData } from '../../lib/mock/dashboardMock'; // Import fetchDashboardData

import DashboardCardsSection from '../../components/DashboardComponents/DashboardCardsSection';
import DashboardCasesTable from '../../components/DashboardComponents/DashboardCasesTable';
import DateFilmstripCalendar from '../../components/DashboardComponents/DateFilmstripCalendar';
import DashboardStatusDisplay from '../../components/DashboardComponents/DashboardStatusDisplay';

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        const loadDashboardInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch initial dashboard data including reportCard and caseStatusCard
                const initialData = await fetchDashboardData();
                setDashboardData(initialData);

                // Then fetch cases for the selected date
                const formattedDate = formatDateToYYYYMMDD(selectedDate);
                const response: AxiosResponse<MainTableRowData[]> = await dataService.casesByHearingDate(formattedDate);
                console.log("Fetched cases by hearing date:", response);
                setDashboardData(prevData => ({
                    ...(prevData || initialData), // Use initialData if prevData is null
                    cases: response.data,
                }));

            } catch (err: unknown) {
                console.error("Failed to load dashboard initial data or cases by hearing date:", err);
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
        loadDashboardInitialData();
    }, [selectedDate]); // Re-run when selectedDate changes

    const handleRowToggleExpand = (rowId: string) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    return (
        <>
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
                        <Box sx={{ flex: 2 }}>
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
        </>
    );
};

export default DashboardPage;
