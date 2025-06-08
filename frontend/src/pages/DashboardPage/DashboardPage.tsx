import { useState, useEffect } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { AxiosError } from 'axios';

import { fetchDashboardData } from '../../lib/mock/dashboardMock';
import type { DashboardData, MainTableRowData } from '../../types/dashboard';
import type { BackendErrorResponse } from '../../types/backendErrorResponse';

import { FullPageBackground, Main, DrawerHeader } from '../../components/DashboardComponents/DashboardStyles';
import DashboardAppBar from '../../components/DashboardComponents/DashboardAppBar';
import DashboardDrawer from '../../components/DashboardComponents/DashboardDrawer';
import DashboardCardsSection from '../../components/DashboardComponents/DashboardCardsSection';
import DashboardSearchBar from '../../components/DashboardComponents/DashboardSearchBar';
import DashboardCasesTable from '../../components/DashboardComponents/DashboardCasesTable';
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
    const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
    const [filteredCases, setFilteredCases] = useState<MainTableRowData[]>([]); // New state for filtered cases
    const [selectedMonth, setSelectedMonth] = useState<string>(''); // State for month dropdown

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

    useEffect(() => {
        if (dashboardData) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = dashboardData.cases.filter(caseItem =>
                caseItem.caseNumber.toLowerCase().includes(lowercasedQuery) ||
                caseItem.filedBy.toLowerCase().includes(lowercasedQuery) ||
                caseItem.applicantName.toLowerCase().includes(lowercasedQuery) ||
                caseItem.respondantName.toLowerCase().includes(lowercasedQuery) ||
                caseItem.assessmentYear.toLowerCase().includes(lowercasedQuery) ||
                caseItem.assessedSection.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredCases(filtered);
        }
    }, [searchQuery, dashboardData]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleSearchDatabase = () => {
        alert(`Searching database for: ${searchQuery}`);
        // Here you would typically make an API call to your backend
        // e.g., dataService.searchCases(searchQuery).then(results => { /* update state */ });
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
                            <DashboardCardsSection
                                dashboardData={dashboardData}
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                setDashboardData={setDashboardData}
                            />

                            <DashboardSearchBar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />

                            <DashboardCasesTable
                                filteredCases={filteredCases}
                                expandedRowId={expandedRowId}
                                handleRowToggleExpand={handleRowToggleExpand}
                                handleSearchDatabase={handleSearchDatabase}
                                searchQuery={searchQuery}
                            />
                        </>
                    )}
                    <DashboardFooter />
                </Main>
            </Box>
        </FullPageBackground>
    );
};

export default DashboardPage;
