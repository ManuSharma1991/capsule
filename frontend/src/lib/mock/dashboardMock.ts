// src/lib/mockData/dashboardMock.ts
import type { DashboardData, HearingData, CaseFinancialsData, ReportCardData } from '../../types/dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import GavelIcon from '@mui/icons-material/Gavel';

const generateHearings = (caseId: string): HearingData[] => [
    { id: `${caseId}-hearing-1`, date: '2023-03-10', remarks: 'Initial hearing, arguments presented.' },
    { id: `${caseId}-hearing-2`, date: '2023-05-20', remarks: 'Further evidence requested.' },
];

const generateFinancials = (caseId: string): CaseFinancialsData => ({
    id: `${caseId}-financials`,
    disputedAmount: `$${(Math.random() * 100000).toFixed(2)}`,
    caseStatus: 'Active', // This can be different from main status if needed
});

export const mockDashboardData: DashboardData = {
    reportCard: {
        title: 'Monthly Reports Generated',
        value: 125, // This value might become redundant or represent a summary
        icon: BarChartIcon,
        color: 'primary.main',
        totalCauseList: 500,
        casesAdjournedCurrentMonth: 50,
        casesAdjournedNextMonth: 30,
        casesAdjournedAfterNextMonth: 20,
        casesAdjournedRemainingMonths: 100,
        casesHeard: 150,
        totalCases: 800,
        monthName: 'November', // Mock month
    },
    caseStatusCard: {
        title: 'Active Case Load',
        totalCases: 150,
        totalCasesPending: 78,
        casesPendingCITDR: 30,
        casesPendingSrDR: 48,
        icon: GavelIcon,
        color: 'secondary.main',
        yearlyData: [
            { year: '2020', totalCases: 100, pendingCases: 40 },
            { year: '2021', totalCases: 120, pendingCases: 55 },
            { year: '2022', totalCases: 135, pendingCases: 60 },
            { year: '2023', totalCases: 150, pendingCases: 78 },
        ],
    },
    cases: [
        {
            id: 'case-001',
            caseNumber: 'ITAT-2023-001',
            filedBy: 'ASSESSEE',
            applicantName: 'John Doe Corp',
            respondantName: 'Income Tax Department', // Placeholder, not used if filedBy is ASSESSEE
            assessmentYear: '2022-23',
            assessedSection: 'Section 143(3)',
            status: 'Open',
            assignedTo: 'Jane Smith',
            lastActivity: '2023-10-26',
            hearings: generateHearings('case-001'),
            financials: generateFinancials('case-001'),
        },
        {
            id: 'case-002',
            caseNumber: 'ITAT-2023-002',
            filedBy: 'DEPARTMENT',
            applicantName: 'Alice Wonderland LLC', // Placeholder, not used if filedBy is DEPARTMENT
            respondantName: 'Commissioner of Income Tax',
            assessmentYear: '2021-22',
            assessedSection: 'Section 263',
            status: 'Pending',
            assignedTo: 'Robert Brown',
            lastActivity: '2023-10-28',
            hearings: generateHearings('case-002'),
            financials: generateFinancials('case-002'),
        },
        {
            id: 'case-003',
            caseNumber: 'ITAT-2023-003',
            filedBy: 'ASSESSEE',
            applicantName: 'Global Solutions Ltd.',
            respondantName: 'Income Tax Department',
            assessmentYear: '2020-21',
            assessedSection: 'Section 254',
            status: 'In Progress',
            assignedTo: 'Jane Smith',
            lastActivity: '2023-11-01',
            hearings: generateHearings('case-003'),
            financials: generateFinancials('case-003'),
        },
        {
            id: 'case-004',
            caseNumber: 'ITAT-2023-004',
            filedBy: 'DEPARTMENT',
            applicantName: 'Innovatech Inc.',
            respondantName: 'Joint Commissioner of Income Tax',
            assessmentYear: '2019-20',
            assessedSection: 'Section 148',
            status: 'Closed',
            assignedTo: 'Emily White',
            lastActivity: '2023-09-15',
            hearings: generateHearings('case-004'),
            financials: generateFinancials('case-004'),
        },
    ],
    selectedMonth: 'November', // Mock selected month
};

export const mockMonths: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to generate mock report card data based on month
export const generateMockReportCardData = (monthName: string): ReportCardData => {
    const baseCauseList = 500;
    const baseAdjourned = 50;
    const baseHeard = 150;

    // Simple variation based on month index for demonstration
    const monthIndex = mockMonths.indexOf(monthName);
    const multiplier = (monthIndex % 3) + 1; // 1, 2, 3, 1, 2, 3...

    return {
        title: 'Monthly Reports Generated',
        value: baseCauseList * multiplier, // Example: total cause list varies
        icon: BarChartIcon,
        color: 'primary.main',
        totalCauseList: baseCauseList * multiplier,
        casesAdjournedCurrentMonth: baseAdjourned * multiplier,
        casesAdjournedNextMonth: baseAdjourned * (multiplier + 0.5),
        casesAdjournedAfterNextMonth: baseAdjourned * (multiplier + 0.2),
        casesAdjournedRemainingMonths: baseAdjourned * (multiplier + 1),
        casesHeard: baseHeard * multiplier,
        totalCases: (baseCauseList + baseHeard) * multiplier,
        monthName: monthName,
    };
};

// Mock data service function (replace with actual API call)
export const fetchDashboardData = (): Promise<DashboardData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Initialize with a default month's data
            const initialMonth = 'November';
            const initialReportCardData = generateMockReportCardData(initialMonth);

            resolve({
                ...mockDashboardData,
                reportCard: initialReportCardData,
                selectedMonth: initialMonth,
            });
        }, 1500); // Simulate network delay
    });
};
