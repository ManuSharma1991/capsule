import { prodDb } from "../../db";
import { caseTable } from "../../db/schema/main";

export const createCase = async (data: any) => {
    // generate case_no from case_type, s_no, place_of_filing, year_of_filing
    const case_no = `${data.case_type} ${data.s_no}/${data.place_of_filing}/${data.year_of_filing}`;
    const newCase = { ...data, case_no };

    await prodDb.insert(caseTable).values(newCase);
    return { message: "Case added", case_no };
};

export const fetchCases = async () => {
    return await prodDb.select().from(caseTable);
};
