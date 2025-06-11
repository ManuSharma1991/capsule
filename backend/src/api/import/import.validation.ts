import { z } from 'zod';

export const importCauseListDataSchema = z.object({
  case_type: z.enum(['ITA', 'MA', 'SA', 'CO']),
  s_no: z.number().int().positive(),
  place_of_filing: z.string().length(3).optional().default('NAG'),
  year_of_filing: z.number().min(1950).max(2100),
  filed_by: z.enum(['A', 'D']),
  bench_type: z.enum(['DB', 'SMC']),
  assessee_name: z.string().min(1),
  assessment_year: z.union([z.string(), z.number()]),
  assessed_section: z.union([z.string().optional(), z.number().optional()]),
  disputed_amount: z.number().nonnegative(),
  argued_by: z.enum(['CIT (DR)', 'Sr. DR']),
  remarks: z.string().optional(),
  next_hearing_date: z.string().optional(),
  hearing_date: z.string(),
});

export const importCauseListArraySchema = z.array(importCauseListDataSchema);

export type ValidationError = {
  index: number;
  errors: z.ZodError<ImportCauseListData>['formErrors'];
};

export const validateImportCauseListArrayPayload = (
  input: unknown
): { success: true; data: ImportCauseListDataArray; errors: ValidationError[] } => {
  const validData: ImportCauseListDataArray = [];
  const errors: ValidationError[] = [];

  if (!Array.isArray(input)) {
    errors.push({
      index: -1,
      errors: { formErrors: ['Input is not an array'], fieldErrors: {} },
    });
    return { success: true, data: [], errors };
  }

  input.forEach((item, index) => {
    const result = importCauseListDataSchema.safeParse(item);
    if (result.success) {
      validData.push(result.data);
    } else {
      errors.push({
        index: index,
        errors: result.error.flatten(),
      });
    }
  });

  return { success: true, data: validData, errors };
};

export type ImportCauseListData = z.infer<typeof importCauseListDataSchema>;
export type ImportCauseListDataArray = z.infer<typeof importCauseListArraySchema>;
