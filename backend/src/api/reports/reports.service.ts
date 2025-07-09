import ExcelJS from 'exceljs';
import path from 'path';
import { CauselistCase } from '../../../../frontend/src/types/cases';

export const exportCauselistToExcel = async (causelistCases: CauselistCase[]): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Causelist');

  const headers = [
    { header: 'S No.', key: 'sno', width: 10 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'ITA No', key: 'itaNo', width: 20 },
    { header: 'Filed By', key: 'filedBy', width: 15 },
    { header: "Assessee's Name", key: 'assesseeName', width: 30 },
    { header: 'AY', key: 'ay', width: 15 },
    { header: 'Section', key: 'section', width: 15 },
    { header: 'Disputed income', key: 'disputedIncome', width: 20 },
    { header: 'Argued by', key: 'arguedBy', width: 20 },
    { header: 'Remarks', key: 'remarks', width: 30 },
  ];

  const categoryOrder = ['DB', 'SMC', 'PHM', 'TMB'];
  let currentRow = 1;

  categoryOrder.forEach((category) => {
    const categoryCases = causelistCases.filter((c) => c.benchType === category);

    if (categoryCases.length > 0) {
      // Add category header row
      worksheet.mergeCells(currentRow, 1, currentRow, headers.length);
      const categoryHeaderCell = worksheet.getCell(currentRow, 1);
      categoryHeaderCell.value = category;
      categoryHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
      categoryHeaderCell.font = { bold: true, size: 14 };
      currentRow++;

      // Add table headers for the category
      worksheet.getRow(currentRow).values = headers.map((h) => h.header);
      worksheet.getRow(currentRow).font = { bold: true };
      currentRow++;

      // Add data rows
      categoryCases.forEach((caseItem, index) => {
        const assesseeName =
          caseItem.filedBy === 'ASSESSEE' ? caseItem.appellantName : caseItem.respondantName;
        const filedByValue = caseItem.filedBy === 'ASSESSEE' ? 'A' : 'D';

        worksheet.getCell(currentRow, 1).value = index + 1;

        const dateCell = worksheet.getCell(currentRow, 2);
        dateCell.value = new Date(caseItem.hearingDate);
        dateCell.numFmt = 'DD-MM-YYYY';

        worksheet.getCell(currentRow, 3).value = caseItem.caseNo;
        worksheet.getCell(currentRow, 4).value = filedByValue;
        worksheet.getCell(currentRow, 5).value = assesseeName;
        worksheet.getCell(currentRow, 6).value = caseItem.assessmentYear;
        worksheet.getCell(currentRow, 7).value = caseItem.assessedSection;
        worksheet.getCell(currentRow, 8).value = caseItem.disputedAmount;
        worksheet.getCell(currentRow, 9).value = caseItem.arguedBy;
        worksheet.getCell(currentRow, 10).value = ''; // Remarks empty by default

        currentRow++;
      });

      // Add a blank row after each category
      currentRow++;
    }
  });

  worksheet.columns = headers.map((h) => ({ key: h.key, width: h.width }));

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `causelist-${timestamp}.xlsx`;
  const filepath = path.join(__dirname, '..', '..', '..', 'exports', filename);

  await workbook.xlsx.writeFile(filepath);

  return filepath;
};
