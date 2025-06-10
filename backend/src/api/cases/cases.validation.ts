import { z } from "zod";

export const caseSchema = z.object({
  case_type: z.enum(['ITA', 'MA', 'SA', 'CO']),
  s_no: z.number().int().positive(),
  place_of_filing: z.string().length(3),
  year_of_filing: z.number().min(1950).max(2100),
  filed_by: z.enum(['ASSESSEE', 'DEPARTMENT']),
  bench_type: z.enum(['DB', 'SMC']),
  appellant_name: z.string().min(1),
  respondant_name: z.string().min(1),
  assessment_year: z.string().regex(/^\d{4}-\d{2}$/),
  assessed_section: z.string().optional(),
  disputed_amount: z.number().nonnegative(),
  argued_by: z.enum(['CIT (DR)', 'Sr DR']), // Updated with space
  case_status: z.enum(['PENDING', 'HEARD', 'COMPLETED']),
  case_result: z.enum(['ALLOWED', 'PARTLY ALLOWED', 'DISMISSED']).nullish(),
  date_of_order: z.string().nullish(),
  date_of_filing: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pan: z.string().length(10),
  authorised_representative: z.string().optional(),
  notes: z.string().optional(),
  is_detail_present: z.number().int().optional(),
  needs_review: z.number().int().optional(),
});

export const getCaseByCaseNoSchema = z.object({
  caseNo: z.string().regex(/^(ITA|MA|SA|CO)\s\d+\/[A-Z]{3}\/\d{4}$/, "Invalid case number format. Expected format: 'TYPE NUMBER/BENCH/YEAR'"),
});

export const validateCasePayload = (input: unknown) => {
  const result = caseSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  }
  return { success: true, data: result.data };
};

export type CaseInput = z.infer<typeof caseSchema>;
export type GetCaseByCaseNoInput = z.infer<typeof getCaseByCaseNoSchema>;
