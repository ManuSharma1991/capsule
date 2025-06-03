// src/lib/mockData/dashboardMock.ts
import type { DashboardData, MainTableRowData, InternalTableRowData } from '../../types/dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import GavelIcon from '@mui/icons-material/Gavel';

const generateInternalDetails = (caseId: string): InternalTableRowData[] => [
    { id: `${caseId}-detail-1`, attribute: 'Filing Date', value: '2023-01-15', lastUpdated: '2023-01-15' },
    { id: `${caseId}-detail-2`, attribute: 'Hearing Date', value: '2023-03-10', lastUpdated: '2023-02-20' },
    { id: `${caseId}-detail-3`, attribute: 'Next Action', value: 'Submit Evidence', lastUpdated: '2023-03-11' },
];

export const mockDashboardData: DashboardData = {
    reportCard: {
        title: 'Monthly Reports Generated',
        value: 125,
        icon: BarChartIcon,
        color: 'primary.main',
    },
    caseStatusCard: {
        title: 'Active Case Load',
        count: 78,
        icon: GavelIcon,
        color: 'secondary.main',
    },
    cases: [
        {
            id: 'case-001',
            caseNumber: 'ITAT-2023-001',
            applicantName: 'John Doe Corp',
            status: 'Open',
            assignedTo: 'Jane Smith',
            lastActivity: '2023-10-26',
            details: generateInternalDetails('case-001'),
        },
        {
            id: 'case-002',
            caseNumber: 'ITAT-2023-002',
            applicantName: 'Alice Wonderland LLC',
            status: 'Pending',
            assignedTo: 'Robert Brown',
            lastActivity: '2023-10-28',
            details: generateInternalDetails('case-002'),
        },
        {
            id: 'case-003',
            caseNumber: 'ITAT-2023-003',
            applicantName: 'Global Solutions Ltd.',
            status: 'In Progress',
            assignedTo: 'Jane Smith',
            lastActivity: '2023-11-01',
            details: generateInternalDetails('case-003'),
        },
        {
            id: 'case-004',
            caseNumber: 'ITAT-2023-004',
            applicantName: 'Innovatech Inc.',
            status: 'Closed',
            assignedTo: 'Emily White',
            lastActivity: '2023-09-15',
            details: generateInternalDetails('case-004'),
        },
    ],
};

// Mock data service function (replace with actual API call)
export const fetchDashboardData = (): Promise<DashboardData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDashboardData);
        }, 1500); // Simulate network delay
    });
};

export const fetchDashboardDataWithError = (): Promise<DashboardData> => {
    return new Promise((_resolve, reject) => {
        setTimeout(() => {
            // Simulate an Axios-like error
            const error = {
                isAxiosError: true,
                response: {
                    data: {
                        message: "Failed to fetch dashboard data from server.",
                        errorCode: "DASHBOARD_FETCH_FAILED"
                    },
                    status: 500,
                    statusText: "Internal Server Error",
                    headers: {},
                    config: {},
                },
                message: "Request failed with status code 500",
                name: "AxiosError",
                code: "ERR_BAD_RESPONSE",
                toJSON: () => ({/* simplified */ })
            };
            reject(error);
        }, 1500);
    });
}