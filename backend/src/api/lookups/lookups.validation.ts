import { z } from 'zod';

export const getCasesByHearingDateSchema = z.object({
    hearingDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid hearingDate format. Please provide in YYYY-MM-DD format.')
        .min(1, 'Hearing date cannot be empty'),
});

export const getCasesByCaseNoSchema = z.object({
    caseNo: z.string()
        .min(1, 'Case number cannot be empty'),
});

export type GetCasesByHearingDateInput = z.infer<typeof getCasesByHearingDateSchema>;
export type GetCasesByCaseNoInput = z.infer<typeof getCasesByCaseNoSchema>;
