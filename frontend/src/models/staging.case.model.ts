export interface StagingCaseModel {
    caseType?: 'ITA' | 'MA' | 'SA' | 'CO';
    sNo?: number;
    placeOfFiling?: string;
    yearOfFiling?: number;
    caseNo?: string;
    filedBy?: 'ASSESSEE' | 'DEPARTMENT';
    benchType?: 'DB' | 'SMC';
    appellantName?: string;
    respondantName?: string;
    assessmentYear?: string;
    assessedSection?: string;
    disputedAmount?: number;
    arguedBy?: 'CIT (DR)' | 'Sr. DR';
    caseStatus?: string;
    caseResult?: string;
    dateOfOrder?: string;
    dateOfFiling?: string;
    pan?: string;
    authorisedRepresentative?: string;
    notes?: string;
    isDetailPresent?: number;
    needsReview?: number;
}
