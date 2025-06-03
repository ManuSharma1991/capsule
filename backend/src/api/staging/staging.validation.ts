import { z } from "zod";

const stagingCaseSchema = z.object({
    case_type: z.enum(["ITA", "MA", "SA"]),
    s_no: z.number().int().positive(),
    place_of_filing: z.string().length(3),
    year_of_filing: z.number().min(1950).max(2100),
    filed_by: z.enum(["ASSESSEE", "DEPARTMENT"]),
    bench_type: z.enum(["DB", "SMC"]),
    appellant_name: z.string().min(1),
    respondant_name: z.string().min(1),
    assessment_year: z.string().nullish(),
    assessed_section: z.string().optional().nullish(),
    disputed_amount: z.number().nonnegative().nullish(),
    argued_by: z.enum(["CIT(DR)", "Sr DR"]),
    case_status: z.enum(["PENDING", "HEARD", "COMPLETED"]).nullish(),
    case_result: z.enum(["ALLOWED", "PARTLY ALLOWED", "DISMISSED"]).nullish(),
    date_of_order: z.string().nullish(),
    date_of_filing: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
    pan: z.string().length(10).nullish(),
    authorised_representative: z.string().optional().nullish(),
    notes: z.string().optional().nullish(),
    is_detail_present: z.number().int().optional().nullish(),
    needs_review: z.number().int().optional().nullish(),
});

export const validateCasePayload = (input: unknown) => {
    const result = stagingCaseSchema.safeParse(input);
    if (!result.success) {
        return { success: false, error: result.error.flatten() };
    }
    return { success: true, data: result.data };
};

export type stagingCaseInput = z.infer<typeof stagingCaseSchema>;

