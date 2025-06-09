import type { Case } from '../../types/cases';

export const mockCases: Case[] = [
    {
        caseNo: 'ITA 252/NAG/2024',
        filedBy: 'John Doe',
        appellantsName: 'ABC Corp',
        respondentsName: 'XYZ Ltd',
        assessmentYear: '2022-23',
        assessedSection: 'Section 143(1)',
        disputedAmount: '1,000,000',
        caseStatus: 'Pending',
        arguedBy: 'Advocate A',
    },
    {
        caseNo: 'ITA 101/DEL/2023',
        filedBy: 'Jane Smith',
        appellantsName: 'PQR Inc',
        respondentsName: 'LMN Group',
        assessmentYear: '2021-22',
        assessedSection: 'Section 263',
        disputedAmount: '500,000',
        caseStatus: 'Closed',
        arguedBy: 'Advocate B',
    },
    {
        caseNo: 'ITA 300/MUM/2024',
        filedBy: 'Alice Johnson',
        appellantsName: 'Tech Solutions',
        respondentsName: 'Global Innovations',
        assessmentYear: '2023-24',
        assessedSection: 'Section 148',
        disputedAmount: '2,500,000',
        caseStatus: 'In Progress',
        arguedBy: 'Advocate C',
    },
    {
        caseNo: 'ITA 050/KOL/2023',
        filedBy: 'Bob Williams',
        appellantsName: 'Data Systems',
        respondentsName: 'Cloud Services',
        assessmentYear: '2020-21',
        assessedSection: 'Section 254',
        disputedAmount: '750,000',
        caseStatus: 'Dismissed',
        arguedBy: 'Advocate A',
    },
    {
        caseNo: 'ITA 150/NAG/2024',
        filedBy: 'Charlie Brown',
        appellantsName: 'Innovate Co',
        respondentsName: 'Future Systems',
        assessmentYear: '2023-24',
        assessedSection: 'Section 143(1)',
        disputedAmount: '1,200,000',
        caseStatus: 'Pending',
        arguedBy: 'Advocate B',
    },
    {
        caseNo: 'ITA 075/DEL/2024',
        filedBy: 'Diana Prince',
        appellantsName: 'Wonder Corp',
        respondentsName: 'Justice League',
        assessmentYear: '2023-24',
        assessedSection: 'Section 263',
        disputedAmount: '800,000',
        caseStatus: 'Closed',
        arguedBy: 'Advocate C',
    },
];

export const fetchCases = async (): Promise<Case[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCases);
        }, 500); // Simulate network delay
    });
};
