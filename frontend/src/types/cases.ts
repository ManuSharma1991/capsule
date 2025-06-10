import type { Hearing } from './dashboard'; // Import the renamed Hearing type

export interface Case {
    id: string; // From caseTable.case_no
    caseType: string;
    sNo: string;
    placeOfFiling: string;
    yearOfFiling: string;
    caseNo: string; // This is the same as id, but keeping both as backend returns both
    filedBy: string;
    benchType: string;
    appellantName: string; // Corrected from appellantsName
    respondantName: string; // Corrected from respondentsName
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
    hearings: Hearing[]; // Using the new Hearing type
}

export interface CauselistCase extends Case {
    causelistSNo: number; // Sequential number for the causelist
    hearingDate: string; // Formatted date string
    remarks: string; // Remarks field
}
