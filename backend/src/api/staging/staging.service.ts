import { stagingDb } from '../../db';
import { CaseTable, caseTable, hearingsTable, HearingTable } from '../../db/schema/staging';
import { ImportCauseListData } from '../import/import.validation';
import { convertToYYYYMMDD } from '../../utils/helpers';

export const createCase = async (data: ImportCauseListData) => {
  // generate case_no from case_type, s_no, place_of_filing, year_of_filing
  const case_no = `${data.case_type} ${data.s_no}/${data.place_of_filing}/${data.year_of_filing}`;

  const newCase: CaseTable = {
    case_type: data.case_type,
    s_no: data.s_no,
    place_of_filing: data.place_of_filing,
    year_of_filing: data.year_of_filing,
    case_no: case_no,
    filed_by: data.filed_by === 'A' ? 'ASSESSEE' : 'DEPARTMENT',
    bench_type: data.bench_type,
    appellant_name: data.filed_by === 'A' ? data.assessee_name : null,
    respondant_name: data.filed_by === 'D' ? data.assessee_name : null,
    assessment_year: data.assessment_year,
    disputed_amount: data.disputed_amount,
    argued_by: data.argued_by,
  };

  if (data.assessed_section !== undefined) {
    newCase.assessed_section = String(data.assessed_section);
  } else {
    newCase.assessed_section = null; // Or undefined, if InsertCaseTable.assessed_section allows undefined
  }

  const firstHearing: HearingTable = {
    hearing_date: convertToYYYYMMDD(data.hearing_date)!,
    case_no: case_no,
    remarks: data.remarks,
  };

  try {
    stagingDb.transaction((tx) => {

      tx.insert(caseTable)
        .values(newCase)
        .onConflictDoUpdate({ target: caseTable.case_no, set: newCase })
        .run();

      tx.insert(hearingsTable).values(firstHearing).run();

      if (data.next_hearing_date) {
        const nextHearingEntry: HearingTable = {
          case_no: case_no,
          hearing_date: convertToYYYYMMDD(data.next_hearing_date)!,
        };
        tx.insert(hearingsTable).values(nextHearingEntry).run();
      }
    });

  } catch (error) {
    console.error('Failed to create case and hearings:', error);
    // Re-throw or handle as appropriate for your error handling strategy
    // For example, you might want to return a specific error response
    // throw new Error(
    //   `Failed to add case: ${error instanceof Error ? error.message : String(error)}`
    // );
    // Or return { success: false, error: "Database operation failed" }
  }
};

export const fetchCases = async () => {
  return await stagingDb.select().from(caseTable);
};
