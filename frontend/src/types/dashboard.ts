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

// Refined Hearing type to match backend response for hearings array
export interface Hearing {
    hearingDate: string; // Matches backend
    remarks: string;     // Matches backend
}

// Refined MainTableRowData to match the flat structure returned by fetchCasesByHearingDate
export interface MainTableRowData {
    id: string; // From caseTable.case_no
    caseType: string;
    sNo: string;
    placeOfFiling: string;
    yearOfFiling: string;
    caseNo: string; // This is the same as id, but keeping both as backend returns both
    filedBy: 'ASSESSEE' | 'DEPARTMENT'; // Keeping the union type for frontend validation
    benchType: string;
    appellantName: string;
    respondantName: string;
    assessmentYear: string;
    assessedSection: string;
    disputedAmount: string;
    arguedBy: string;
    caseStatus: string;
    caseResult: string;
    dateOfOrder: string;
    dateOfFiling: string;
    pan: string;
    authorisedRepresentative: string;
    notes: string;
    isDetailPresent: boolean;
    needsReview: boolean;
    hearingDate: string; // From hearingsTable.hearing_date
}

export interface DashboardData {
    reportCard: ReportCardData;
    caseStatusCard: CaseStatusData;
    cases: MainTableRowData[]; // Still uses MainTableRowData for the dashboard table
    selectedMonth: string;
}

// You might also reuse this from your auth types
export interface BackendErrorResponse {
    message: string;
    errorCode?: string;
    details?: Record<string, string>;
}
