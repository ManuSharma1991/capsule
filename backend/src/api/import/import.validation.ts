import { z } from 'zod';
import { loginSchema } from '../auth/auth.validation';

export const importCauseListDataSchema = z.object({
    case_type: z.enum(["ITA", "MA", "SA"]),
    s_no: z.number().int().positive(),
    place_of_filing: z.string().length(3),
    year_of_filing: z.number().min(1950).max(2100),
    filed_by: z.enum(["ASSESSEE", "DEPARTMENT"]),
    bench_type: z.enum(["DB", "SMC"]),
    assessee_name: z.string().min(1),
    assessment_year: z.string(),
    assessed_section: z.string().optional(),
    disputed_amount: z.number().nonnegative(),
    argued_by: z.enum(["CIT(DR)", "Sr DR"]),
    authorised_representative: z.string().optional(),
    remarks: z.string().optional(),
    next_hearing_date: z.string().optional(),
    hearing_date: z.string(),
});


export const importCauseListArraySchema = z.array(importCauseListDataSchema);

export const validateImportCauseListArrayPayload = (input: unknown):
    | { success: true; data: ImportCauseListDataArray }
    | { success: false; error: z.ZodError<ImportCauseListDataArray>['formErrors'] } => {
    const result = importCauseListArraySchema.safeParse(input); // Use the array schema here
    if (!result.success) {
        // result.error.flatten() gives you a structured error object.
        // { formErrors: [], fieldErrors: { '[index].fieldName': ['Error message'] } }
        return { success: false, error: result.error.flatten() };
    }
    return { success: true, data: result.data };
};

export type ImportCauseListData = z.infer<typeof importCauseListDataSchema>;
export type ImportCauseListDataArray = z.infer<typeof importCauseListArraySchema>;

