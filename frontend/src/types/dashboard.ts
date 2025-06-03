// src/types/dashboard.ts
export interface ReportCardData {
    title: string;
    value: string | number;
    icon?: React.ElementType; // For an optional icon
    color?: string;
}

export interface CaseStatusData {
    title: string;
    count: number;
    icon?: React.ElementType;
    color?: string;
}

export interface InternalTableRowData {
    id: string;
    attribute: string;
    value: string;
    lastUpdated: string;
}

export interface MainTableRowData {
    id: string;
    caseNumber: string;
    applicantName: string;
    status: 'Open' | 'Closed' | 'Pending' | 'In Progress';
    assignedTo: string;
    lastActivity: string;
    details: InternalTableRowData[]; // Data for the expandable internal table
}

export interface DashboardData {
    reportCard: ReportCardData;
    caseStatusCard: CaseStatusData;
    cases: MainTableRowData[];
}

// You might also reuse this from your auth types
export interface BackendErrorResponse {
    message: string;
    errorCode?: string;
    details?: Record<string, string>;
}