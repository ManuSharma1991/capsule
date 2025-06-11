import { stagingDb } from '../../db';
import { caseTable } from '../../db/schema/staging';
import * as stagingCaseService from '../staging/staging.service';
import { ImportCauseListData, ImportScraperData } from './import.validation';

export const importCases = async (data: ImportCauseListData[]) => {
  // generate case_no from case_type, s_no, place_of_filing, year_of_filing
  let counter = 0;
  for (const caseData of data) {
    await stagingCaseService.createCase(caseData);
    counter++;
  }
  return { message: 'cases imported : ', counter };
};

export const importScraperData = async (data: ImportScraperData[]) => {
  // generate case_no from case_type, s_no, place_of_filing, year_of_filing
  let counter = 0;
  for (const caseData of data) {
    await stagingCaseService.createScraperCase(caseData);
    counter++;
  }
  return { message: 'cases imported : ', counter };
};

export const fetchCases = async () => {
  return await stagingDb.select().from(caseTable);
};
