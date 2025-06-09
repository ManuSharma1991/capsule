import * as fs from 'fs';
import * as ExcelJS from 'exceljs';

/**
 * Converts an Excel file (ODS, XLSX, etc.) into JSON format.
 * This utility supports reading from file paths, Buffers, or ArrayBuffers.
 * It can handle multiple sheets and allows for configuration of how data is parsed.
 *
 * @module excelToJson
 */

export type SheetData = Record<string, unknown>[];

// The result will be an object where keys are sheet names
// and values are the SheetData for that sheet
export type ExcelJsonData = Record<string, SheetData>;

interface ExcelToJsonOptions {
  /**
   * If specified, only this sheet will be processed.
   * Can be the sheet name (string) or 0-based index (number).
   * If undefined, all sheets are processed.
   */
  sheetNameOrIndex?: string | number;
  /**
   * If true, raw values are returned (Date objects for dates, numbers for numbers).
   * If false, formatted text is used (numbers might become strings, dates are formatted by xlsx).
   * For custom date formatting, it's recommended to use rawValues: true and format dates manually.
   * Defaults to true for better type preservation and custom date handling.
   */
  rawValues?: boolean;
  /**
   * Passed to XLSX.utils.sheet_to_json if rawValues is false.
   * Use this to specify a date format string if dates are not parsing correctly AND rawValues is false.
   * e.g., "yyyy-mm-dd"
   * Note: This option has no effect if rawValues is true, as date formatting is handled post-conversion.
   */
  dateNF?: string; // This option is specific to XLSX, might not be directly applicable to ExcelJS
  /**
   * Passed to XLSX.utils.sheet_to_json.
   * If true, blank rows will be skipped. If false (default), they will be included.
   */
  skipBlankRows?: boolean;
  /**
   * A function to format JavaScript Date objects into strings.
   * If not provided, and rawValues is true, Date objects will be left as is (and may stringify to ISO format).
   * Default formats to 'YYYY-MM-DD'.
   */
  customDateFormatter?: (date: Date) => string;
}

const defaultDateFormatter = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts an Excel file (ODS, XLSX, etc.) into JSON.
 *
 * @param fileInput Can be a file path (string, for Node.js),
 *                  a Buffer, or an ArrayBuffer.
 * @param options Optional configuration for parsing.
 * @returns A Promise resolving to an object where keys are sheet names
 *          and values are arrays of row objects. If options.sheetNameOrIndex
 *          is specified, it returns an object with only that sheet's data
 *          or just the array of row objects if only one sheet is requested.
 */
export const excelFileToJson = async (
  fileInput: string | Buffer | ArrayBuffer,
  options: ExcelToJsonOptions = {}
): Promise<ExcelJsonData | SheetData> => {
  try {
    const workbook = new ExcelJS.Workbook();
    const result: ExcelJsonData = {};

    if (typeof fileInput === 'string') {
      if (!fs.existsSync(fileInput)) {
        throw new Error(`File not found: ${fileInput}`);
      }
      // Use streaming for file paths
      await workbook.xlsx.readFile(fileInput);
    } else if (Buffer.isBuffer(fileInput)) {
      await workbook.xlsx.load(fileInput);
    } else if (fileInput instanceof ArrayBuffer) {
      await workbook.xlsx.load(fileInput);
    } else {
      throw new Error('Invalid file input type. Expected string (path), Buffer, or ArrayBuffer.');
    }

    const useRawValues = options.rawValues === undefined ? true : options.rawValues;
    const dateFormatter = options.customDateFormatter || defaultDateFormatter;

    let sheetsToProcess: string[] = [];
    if (options.sheetNameOrIndex !== undefined) {
      if (typeof options.sheetNameOrIndex === 'string') {
        const sheet = workbook.getWorksheet(options.sheetNameOrIndex);
        if (!sheet) {
          throw new Error(`Sheet "${options.sheetNameOrIndex}" not found in the workbook.`);
        }
        sheetsToProcess = [options.sheetNameOrIndex];
      } else if (typeof options.sheetNameOrIndex === 'number') {
        const sheet = workbook.getWorksheet(options.sheetNameOrIndex + 1); // ExcelJS is 1-based for index
        if (!sheet) {
          throw new Error(`Sheet index ${options.sheetNameOrIndex} is out of bounds.`);
        }
        sheetsToProcess = [sheet.name];
      }
    } else {
      workbook.eachSheet((sheet) => {
        sheetsToProcess.push(sheet.name);
      });
    }

    for (const sheetName of sheetsToProcess) {
      const worksheet = workbook.getWorksheet(sheetName);
      if (!worksheet) continue;

      const sheetData: SheetData = [];
      let headers: string[] = [];
      let isFirstRow = true;

      worksheet.eachRow({ includeEmpty: !options.skipBlankRows }, (row) => {
        if (isFirstRow) {
          // Assuming first row is headers. ExcelJS row.values includes null at index 0.
          // Manually build headers array to avoid complex type inference issues
          headers = [];
          // Explicitly cast row.values to ExcelJS.CellValue[]
          const rowValues: ExcelJS.CellValue[] = row.values as ExcelJS.CellValue[];
          for (let i = 1; i < rowValues.length; i++) { // Start from index 1 to skip null
            const cellValue = rowValues[i];
            if (cellValue !== null && cellValue !== undefined) {
              headers.push(String(cellValue));
            } else {
              headers.push(''); // Push empty string for empty header cells
            }
          }
          // Filter out any empty strings if they are not desired as headers
          headers = headers.filter(Boolean);
          isFirstRow = false;
          return; // Skip header row from data
        }

        const rowObject: Record<string, unknown> = {};
        let hasDataInRow = false;

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = headers[colNumber - 1]; // ExcelJS colNumber is 1-based
          if (!header) return; // Skip if no header for this column

          let value: unknown = cell.value;

          if (value instanceof Date) {
            if (useRawValues) {
              value = dateFormatter(value);
            } else {
              // ExcelJS handles formatted text for dates if not raw, but we can also use cell.text
              value = cell.text;
            }
          } else if (cell.type === ExcelJS.ValueType.Formula && cell.result !== undefined) {
            value = cell.result; // Use formula result
          } else if (value === null || value === undefined) {
            value = ''; // Default value for blank cells
          }

          if (value !== '' && value !== null && value !== undefined) {
            hasDataInRow = true;
          }
          rowObject[header] = value;
        });

        if (options.skipBlankRows && !hasDataInRow) {
          return; // Skip if row is blank and option is set
        }
        sheetData.push(rowObject);
      });
      result[sheetName] = sheetData;
    }

    if (options.sheetNameOrIndex !== undefined && sheetsToProcess.length === 1) {
      return result[sheetsToProcess[0]];
    }

    return result;
  } catch (error) {
    console.error('Error converting Excel to JSON:', error);
    throw new Error(
      `Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
