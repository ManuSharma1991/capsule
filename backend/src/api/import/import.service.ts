import { stagingDb } from "../../db";
import { caseTable } from "../../db/schema/staging";
import * as stagingCaseService from "../staging/staging.service";
import { stagingCaseInput } from "../staging/staging.validation";
import { ImportCauseListData } from "./import.validation";

export const importCases = async (data: Partial<ImportCauseListData>[]) => {
    // generate case_no from case_type, s_no, place_of_filing, year_of_filing
    let counter = 0;
    for (const caseData of data) {
        const case_no = `${caseData.case_type} ${caseData.s_no}/${caseData.place_of_filing}/${caseData.year_of_filing}`;
        const newCase = { ...caseData, case_no };

        await stagingCaseService.createCase(newCase);
        counter++;
    }
    return { message: "cases imported : ", counter };
};

export const fetchCases = async () => {
    return await stagingDb.select().from(caseTable);
};