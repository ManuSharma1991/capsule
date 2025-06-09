import { stagingDb } from '../../db';
import { caseTable } from '../../db/schema/main/case.schema';
import { hearingsTable } from '../../db/schema/main/hearing.schema';
import { eq } from 'drizzle-orm';

class LookupsService {
    public async fetchCasesByHearingDate(hearingDate: string) {
        try {
            const casesData = await stagingDb
                .select({
                    id: caseTable.case_no, // Using case_no as a unique identifier for the case
                    caseType: caseTable.case_type,
                    sNo: caseTable.s_no,
                    placeOfFiling: caseTable.place_of_filing,
                    yearOfFiling: caseTable.year_of_filing,
                    caseNo: caseTable.case_no,
                    filedBy: caseTable.filed_by,
                    benchType: caseTable.bench_type,
                    appellantName: caseTable.appellant_name,
                    respondantName: caseTable.respondant_name,
                    assessmentYear: caseTable.assessment_year,
                    assessedSection: caseTable.assessed_section,
                    disputedAmount: caseTable.disputed_amount,
                    arguedBy: caseTable.argued_by,
                    caseStatus: caseTable.case_status,
                    caseResult: caseTable.case_result,
                    dateOfOrder: caseTable.date_of_order,
                    dateOfFiling: caseTable.date_of_filing,
                    pan: caseTable.pan,
                    authorisedRepresentative: caseTable.authorised_representative,
                    notes: caseTable.notes,
                    isDetailPresent: caseTable.is_detail_present,
                    needsReview: caseTable.needs_review,
                    hearingDate: hearingsTable.hearing_date, // Include hearing date from hearings table
                })
                .from(caseTable)
                .innerJoin(hearingsTable, eq(caseTable.case_no, hearingsTable.case_no))
                .where(eq(hearingsTable.hearing_date, hearingDate));

            return casesData;
        } catch (error) {
            console.error('Error fetching cases by hearing date:', error);
            throw error;
        }
    }
}

export default new LookupsService();
