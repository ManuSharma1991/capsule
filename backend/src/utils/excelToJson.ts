import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Buffer } from 'buffer';

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
  dateNF?: string;
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
    let workbook: XLSX.WorkBook;

    // Always use cellDates: true when reading the workbook to get JS Date objects
    const readOpts: XLSX.ParsingOptions = { cellDates: true };

    if (typeof fileInput === 'string') {
      if (!fs.existsSync(fileInput)) {
        throw new Error(`File not found: ${fileInput}`);
      }
      workbook = XLSX.readFile(fileInput, readOpts);
    } else if (Buffer.isBuffer(fileInput)) {
      workbook = XLSX.read(fileInput, { ...readOpts, type: 'buffer' });
    } else if (fileInput instanceof ArrayBuffer) {
      workbook = XLSX.read(new Uint8Array(fileInput), { ...readOpts, type: 'array' });
    } else {
      throw new Error('Invalid file input type. Expected string (path), Buffer, or ArrayBuffer.');
    }

    const result: ExcelJsonData = {};
    let sheetToProcess: string[] = workbook.SheetNames;

    if (options.sheetNameOrIndex !== undefined) {
      if (typeof options.sheetNameOrIndex === 'string') {
        if (!workbook.SheetNames.includes(options.sheetNameOrIndex)) {
          throw new Error(`Sheet "${options.sheetNameOrIndex}" not found in the workbook.`);
        }
        sheetToProcess = [options.sheetNameOrIndex];
      } else if (typeof options.sheetNameOrIndex === 'number') {
        if (
          options.sheetNameOrIndex < 0 ||
          options.sheetNameOrIndex >= workbook.SheetNames.length
        ) {
          throw new Error(`Sheet index ${options.sheetNameOrIndex} is out of bounds.`);
        }
        sheetToProcess = [workbook.SheetNames[options.sheetNameOrIndex]];
      }
    }

    // Default to raw: true for better type handling and custom date formatting.
    // If user explicitly sets rawValues: false, then use that.
    const useRawValues = options.rawValues === undefined ? true : options.rawValues;

    const sheetToJsonOptions: XLSX.Sheet2JSONOpts = {
      raw: useRawValues,
      defval: '', // Default value for blank cells
    };

    if (!useRawValues && options.dateNF) {
      // dateNF only makes sense if rawValues is false
      sheetToJsonOptions.dateNF = options.dateNF;
    }

    if (options.skipBlankRows) {
      sheetToJsonOptions.blankrows = false;
    } else {
      sheetToJsonOptions.blankrows = true;
    }

    const dateFormatter = options.customDateFormatter || defaultDateFormatter;

    for (const sheetName of sheetToProcess) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      let jsonData: SheetData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        sheetToJsonOptions
      );

      // If rawValues is true (or default), post-process to format dates
      if (useRawValues) {
        jsonData = jsonData.map((row) => {
          const newRow: Record<string, unknown> = {};
          for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
              const value = row[key];
              if (value instanceof Date) {
                newRow[key] = dateFormatter(value);
              } else {
                newRow[key] = value;
              }
            }
          }
          return newRow;
        });
      }
      result[sheetName] = jsonData;
    }

    if (options.sheetNameOrIndex !== undefined && sheetToProcess.length === 1) {
      return result[sheetToProcess[0]];
    }

    return result;
  } catch (error) {
    console.error('Error converting Excel to JSON:', error);
    throw new Error(
      `Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};
