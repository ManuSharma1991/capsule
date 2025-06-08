// src/types/dashboard.ts
export interface ReportCardData {
    title: string;
    value: string | number;
    icon?: React.ElementType; // For an optional icon
    color?: string;
    totalCauseList: number;
    casesAdjournedCurrentMonth: number;
    casesAdjournedNextMonth: number;
    casesAdjournedAfterNextMonth: number;
    casesAdjournedRemainingMonths: number;
    casesHeard: number;
    totalCases: number;
    monthName: string;
}

export interface YearlyCaseData {
    year: string;
    totalCases: number;
    pendingCases: number;
}

export interface CaseStatusData {
    title: string;
    totalCases: number;
    totalCasesPending: number;
    casesPendingCITDR: number;
    casesPendingSrDR: number;
    icon?: React.ElementType;
    color?: string;
    yearlyData?: YearlyCaseData[]; // New field for bar chart data
}

export interface HearingData {
    id: string;
    date: string;
    remarks: string;
}

export interface CaseFinancialsData {
    id: string;
    disputedAmount: string;
    caseStatus: string; // This might be redundant with MainTableRowData.status, but keeping for now as per request
    // Add other relevant financial/status details here as needed
}

export interface MainTableRowData {
    id: string;
    caseNumber: string;
    filedBy: 'ASSESSEE' | 'DEPARTMENT'; // New field
    applicantName: string; // Assessee's name if filedBy is ASSESSEE
    respondantName: string; // Department's name if filedBy is DEPARTMENT
    assessmentYear: string; // New field
    assessedSection: string; // New field
    status: 'Open' | 'Closed' | 'Pending' | 'In Progress';
    assignedTo: string;
    lastActivity: string;
    hearings: HearingData[]; // Changed from 'details' to 'hearings'
    financials: CaseFinancialsData; // New field for financial/status details
}

export interface DashboardData {
    reportCard: ReportCardData;
    caseStatusCard: CaseStatusData;
    cases: MainTableRowData[];
    selectedMonth: string;
}

// You might also reuse this from your auth types
export interface BackendErrorResponse {
    message: string;
    errorCode?: string;
    details?: Record<string, string>;
}
