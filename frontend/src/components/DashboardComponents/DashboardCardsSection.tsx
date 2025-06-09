import { type FC } from 'react';
import {
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material';
import YearlyCasesBarChart from '../YearlyCasesBarChart';
import { DashboardCard } from './DashboardStyles';
import type { DashboardData } from '../../types/dashboard';
import { mockMonths, generateMockReportCardData } from '../../lib/mock/dashboardMock';

interface DashboardCardsSectionProps {
    dashboardData: DashboardData;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    setDashboardData: (data: DashboardData) => void;
}

const DashboardCardsSection: FC<DashboardCardsSectionProps> = ({
    dashboardData,
    selectedMonth,
    setSelectedMonth,
    setDashboardData,
}) => {
    const { reportCard, caseStatusCard } = dashboardData;

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

        if (dashboardData) {
            const updatedReportCard = generateMockReportCardData(newMonth);
            setDashboardData({
                ...dashboardData,
                reportCard: updatedReportCard,
                selectedMonth: newMonth,
            });
        }
    };

    return (
        <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0 }}>
            {/* Active Case Load Card (Full width within its parent) */}
            <Grid size={{ xs: 12, md: 12 }} sx={{ height: '100%' }}>
                <DashboardCard elevation={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {caseStatusCard.icon && <caseStatusCard.icon sx={{ fontSize: 30, color: caseStatusCard.color || 'secondary.main', mr: 1 }} />}
                            <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                                {caseStatusCard.title}
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Total Cases: {caseStatusCard.totalCases}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Total Cases Pending: {caseStatusCard.totalCasesPending}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Cases pending for CIT(DR): {caseStatusCard.casesPendingCITDR}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            Cases pending for Sr. DR: {caseStatusCard.casesPendingSrDR}
                        </Typography>
                    </Box>
                    {/* Bar Chart */}
                    {caseStatusCard.yearlyData && (
                        <Box sx={{ width: '40%', ml: 2 }}>
                            <YearlyCasesBarChart data={caseStatusCard.yearlyData} />
                        </Box>
                    )}
                </DashboardCard>
            </Grid>
            {/* Monthly Reports Card (Full width within its parent) */}
            <Grid size={{ xs: 12, md: 12 }} sx={{ height: '100%' }}>
                <DashboardCard elevation={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 1 }}>
                        <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                            {reportCard.title}
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
                    {reportCard.icon && <reportCard.icon sx={{ fontSize: 40, color: reportCard.color || 'primary.main', alignSelf: 'flex-end' }} />}
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Total CauseList for the month of {reportCard.monthName}: {reportCard.totalCauseList}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned during the month of {reportCard.monthName}: {reportCard.casesAdjournedCurrentMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the month of {getNextMonthName(reportCard.monthName, 1)}: {reportCard.casesAdjournedNextMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the month of {getNextMonthName(reportCard.monthName, 2)}: {reportCard.casesAdjournedAfterNextMonth}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases adjourned for the months of {getNextMonthName(reportCard.monthName, 3)} onwards: {reportCard.casesAdjournedRemainingMonths}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Cases heard: {reportCard.casesHeard}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Total cases: {reportCard.totalCases}
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
