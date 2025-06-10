import { type FC, type Dispatch, type SetStateAction } from 'react';
import {
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    CircularProgress, // Import CircularProgress
    Alert, // Import Alert
} from '@mui/material';
import YearlyCasesBarChart from '../YearlyCasesBarChart';
import { DashboardCard } from './DashboardStyles';
import type { ReportCardData, CaseStatusData } from '../../types/dashboard';
import { mockMonths, generateMockReportCardData } from '../../lib/mock/dashboardMock';

interface DashboardCardsSectionProps {
    reportCardData: ReportCardData | null;
    caseStatusCardData: CaseStatusData | null;
    selectedMonth: string;
    setSelectedMonth: Dispatch<SetStateAction<string>>;
    setReportCardData: Dispatch<SetStateAction<ReportCardData | null>>;
    isLoadingCards: boolean;
    errorCards: string | null;
}

const DashboardCardsSection: FC<DashboardCardsSectionProps> = ({
    reportCardData,
    caseStatusCardData,
    selectedMonth,
    setSelectedMonth,
    setReportCardData,
    isLoadingCards,
    errorCards,
}) => {
    const getNextMonthName = (currentMonthName: string, offset: number = 1): string => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentIndex = months.indexOf(currentMonthName);
        if (currentIndex === -1) return '';
        const nextIndex = (currentIndex + offset) % 12;
        return months[nextIndex];
    };

    const handleMonthChange = (event: SelectChangeEvent<string>) => {
        const newMonth = event.target.value;
        setSelectedMonth(newMonth);

        // Simulate fetching new data for the report card based on month change
        const updatedReportCard = generateMockReportCardData(newMonth);
        setReportCardData(updatedReportCard);
    };

    if (isLoadingCards) {
        return (
            <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading Cards...</Typography>
            </Grid>
        );
    }

    if (errorCards) {
        return (
            <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0 }}>
                <Grid size={{ xs: 12 }}>
                    <Alert severity="error">{errorCards}</Alert>
                </Grid>
            </Grid>
        );
    }

    if (!reportCardData || !caseStatusCardData) {
        return (
            <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0 }}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" color="text.secondary">No card data available.</Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0 }}>
            {/* Active Case Load Card (Full width within its parent) */}
            <Grid size={{ xs: 12, md: 12 }} sx={{ height: '100%' }}>
                <DashboardCard elevation={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {/* {caseStatusCardData.icon && <caseStatusCardData.icon sx={{ fontSize: 30, color: caseStatusCardData.color || 'secondary.main', mr: 1 }} />} */}
                            <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                                {caseStatusCardData.title}
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Total Cases: {caseStatusCardData.totalCases}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Total Cases Pending: {caseStatusCardData.totalCasesPending}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Cases pending for CIT(DR): {caseStatusCardData.casesPendingCITDR}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Cases pending for Sr. DR: {caseStatusCardData.casesPendingSrDR}
                        </Typography>
                    </Box>
                    {/* Bar Chart */}
                    {caseStatusCardData.yearlyData && (
                        <Box sx={{ width: '40%', ml: 2 }}>
                            <YearlyCasesBarChart data={caseStatusCardData.yearlyData} />
                        </Box>
                    )}
                </DashboardCard>
            </Grid>
            {/* Monthly Reports Card (Full width within its parent) */}
            <Grid size={{ xs: 12, md: 12 }} sx={{ height: '100%' }}>
                <DashboardCard elevation={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                        <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                            {reportCardData.title}
                        </Typography>
                        {/* Month Dropdown for Report Card */}
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="month-select-label-card" sx={{ color: 'text.secondary' }}>Month</InputLabel>
                            <Select
                                labelId="month-select-label-card"
                                id="month-select-card"
                                value={selectedMonth}
                                label="Month"
                                onChange={handleMonthChange}
                                sx={{
                                    color: 'text.primary',
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' },
                                    '.MuiSvgIcon-root': { color: 'text.secondary' },
                                }}
                            >
                                {mockMonths.map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* {reportCardData.icon && <reportCardData.icon sx={{ fontSize: 40, color: reportCardData.color || 'primary.main', alignSelf: 'flex-end' }} />} */}
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Total CauseList for the month of {reportCardData.monthName}: {reportCardData.totalCauseList}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned during the month of {reportCardData.monthName}: {reportCardData.casesAdjournedCurrentMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the month of {getNextMonthName(reportCardData.monthName, 1)}: {reportCardData.casesAdjournedNextMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the month of {getNextMonthName(reportCardData.monthName, 2)}: {reportCardData.casesAdjournedAfterNextMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the months of {getNextMonthName(reportCardData.monthName, 3)} onwards: {reportCardData.casesAdjournedRemainingMonths}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases heard: {reportCardData.casesHeard}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Total cases: {reportCardData.totalCases}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                        Last updated: Just now
                    </Typography>
                </DashboardCard>
            </Grid>
        </Grid>
    );
};

export default DashboardCardsSection;
