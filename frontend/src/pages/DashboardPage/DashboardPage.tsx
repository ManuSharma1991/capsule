import { useState, useEffect } from 'react';
import {
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';

import { dataService } from '../../services/data.service';
import type { DashboardData, MainTableRowData, ReportCardData, CaseStatusData } from '../../types/dashboard';
import type { BackendErrorResponse } from '../../types/backendErrorResponse';
import { fetchDashboardData } from '../../lib/mock/dashboardMock';

import DashboardCardsSection from '../../components/DashboardComponents/DashboardCardsSection';
import DashboardCasesTable from '../../components/DashboardComponents/DashboardCasesTable';
import DateFilmstripCalendar from '../../components/DashboardComponents/DateFilmstripCalendar';
import DashboardStatusDisplay from '../../components/DashboardComponents/DashboardStatusDisplay';

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [reportCardData, setReportCardData] = useState<ReportCardData | null>(null);
    const [caseStatusCardData, setCaseStatusCardData] = useState<CaseStatusData | null>(null);
    const [casesData, setCasesData] = useState<MainTableRowData[]>([]);
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [errorCards, setErrorCards] = useState<string | null>(null);
    const [errorTable, setErrorTable] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Effect for fetching initial dashboard card data (runs once)
    useEffect(() => {
        const loadCardData = async () => {
            setIsLoadingCards(true);
            setErrorCards(null);
            try {
                const initialData = await fetchDashboardData();
                setReportCardData(initialData.reportCard);
                setCaseStatusCardData(initialData.caseStatusCard);
            } catch (err: unknown) {
                console.error("Failed to load dashboard card data:", err);
                let displayMessage = "An unexpected error occurred.";
                if (err instanceof AxiosError && err.response && err.response.data && typeof err.response.data === 'object') {
                    const backendError = err.response.data as Partial<BackendErrorResponse>;
                    displayMessage = backendError.message || "Server error fetching card data.";
                } else if (err instanceof Error) {
                    displayMessage = err.message;
                }
                setErrorCards(displayMessage);
            } finally {
                setIsLoadingCards(false);
            }
        };
        loadCardData();
    }, []); // Empty dependency array means this runs once on mount

    // Effect for fetching cases data (runs when selectedDate changes)
    useEffect(() => {
        const loadCasesData = async () => {
            setIsLoadingTable(true);
            setErrorTable(null);
            try {
                const formattedDate = formatDateToYYYYMMDD(selectedDate);
                const response: AxiosResponse<MainTableRowData[]> = await dataService.casesByHearingDate(formattedDate);
                console.log("Fetched cases by hearing date:", response);
                setCasesData(response.data);
            } catch (err: unknown) {
                console.error("Failed to load cases by hearing date:", err);
                let displayMessage = "An unexpected error occurred.";
                if (err instanceof AxiosError && err.response && err.response.data && typeof err.response.data === 'object') {
                    const backendError = err.response.data as Partial<BackendErrorResponse>;
                    displayMessage = backendError.message || "Server error fetching cases data.";
                } else if (err instanceof Error) {
                    displayMessage = err.message;
                }
                setErrorTable(displayMessage);
            } finally {
                setIsLoadingTable(false);
            }
        };
        loadCasesData();
    }, [selectedDate]); // Re-run when selectedDate changes

    const handleRowToggleExpand = (rowId: string) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    const dashboardDataForDisplay: DashboardData | null = (reportCardData || caseStatusCardData) ? {
        reportCard: reportCardData || { title: '', value: '', totalCauseList: 0, casesAdjournedCurrentMonth: 0, casesAdjournedNextMonth: 0, casesAdjournedAfterNextMonth: 0, casesAdjournedRemainingMonths: 0, casesHeard: 0, totalCases: 0, monthName: '' },
        caseStatusCard: caseStatusCardData || { title: '', totalCases: 0, totalCasesPending: 0, casesPendingCITDR: 0, casesPendingSrDR: 0 },
        cases: casesData,
        selectedMonth: selectedMonth,
    } : null;

    return (
        <>
            <DashboardStatusDisplay
                dashboardData={dashboardDataForDisplay}
            />

            {/* Render content only if cards data is loaded or loading, and not in a full-page error state */}
            {(reportCardData || caseStatusCardData || isLoadingCards) && !errorCards && (
                <>
                    <DateFilmstripCalendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, alignSelf: 'flex-start', zIndex: 1 }}>
                            <Box mt={2}>
                                <DashboardCardsSection
                                    reportCardData={reportCardData}
                                    caseStatusCardData={caseStatusCardData}
                                    selectedMonth={selectedMonth}
                                    setSelectedMonth={setSelectedMonth}
                                    setReportCardData={setReportCardData}
                                    isLoadingCards={isLoadingCards}
                                    errorCards={errorCards}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ flex: 2 }}>
                            <DashboardCasesTable
                                cases={casesData}
                                expandedRowId={expandedRowId}
                                handleRowToggleExpand={handleRowToggleExpand}
                                selectedDate={selectedDate}
                                isLoadingTable={isLoadingTable}
                                errorTable={errorTable}
                            />
                        </Box>
                    </Box>
                </>
            )}
            {/* Display full-page error for cards if they fail to load initially */}
            {errorCards && (
                <DashboardStatusDisplay
                    error={errorCards}
                    isLoading={false}
                    dashboardData={null}
                />
            )}
        </>
    );
};

export default DashboardPage;
