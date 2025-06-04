import { Router } from 'express';
import { tryCatchWrapper } from '../../utils/helpers';
import { importCases } from './import.controller';
import { excelFileToJson } from '../../utils/excelToJson';

const importRoutes = Router();

importRoutes.post('/importCauselistData', tryCatchWrapper(importCases));
importRoutes.get('/convertExcelToJson', async (req, res, next) => {
  console.log('Current Working Directory (CWD):', process.cwd());
  console.log('Directory of this file (__dirname):', __dirname);

  try {
    const data = await excelFileToJson('test.xlsx', {
      sheetNameOrIndex: 0,
      skipBlankRows: true,
      rawValues: true,
      dateNF: 'yyyy-mm-dd',
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default importRoutes;
