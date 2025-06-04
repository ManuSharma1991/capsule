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
     * Passed to XLSX.utils.sheet_to_json.
     * If true, raw values are returned. If false (default), formatted text is used.
     * Dates are typically converted to JS Date objects if raw is false.
     */
    rawValues?: boolean;
    /**
     * Passed to XLSX.utils.sheet_to_json.
     * Use this to specify a date format string if dates are not parsing correctly.
     * e.g., "yyyy-mm-dd"
     */
    dateNF?: string;
    /**
     * Passed to XLSX.utils.sheet_to_json.
     * If true, blank rows will be skipped. If false (default), they will be included.
     */
    skipBlankRows?: boolean;
}

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

        if (typeof fileInput === 'string') {
            // Reading from file path (Node.js specific)
            if (!fs.existsSync(fileInput)) {
                throw new Error(`File not found: ${fileInput}`);
            }
            workbook = XLSX.readFile(fileInput, { cellDates: true }); // cellDates: true helps with date parsing
        } else if (Buffer.isBuffer(fileInput)) {
            workbook = XLSX.read(fileInput, { type: 'buffer', cellDates: true });
        } else if (fileInput instanceof ArrayBuffer) {
            workbook = XLSX.read(new Uint8Array(fileInput), { type: 'array', cellDates: true });
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
                if (options.sheetNameOrIndex < 0 || options.sheetNameOrIndex >= workbook.SheetNames.length) {
                    throw new Error(`Sheet index ${options.sheetNameOrIndex} is out of bounds.`);
                }
                sheetToProcess = [workbook.SheetNames[options.sheetNameOrIndex]];
            }
        }

        const sheetToJsonOptions: XLSX.Sheet2JSONOpts = {
            raw: options.rawValues === undefined ? false : options.rawValues, // default to false for better date handling
            defval: '', // Default value for blank cells
        };
        if (options.dateNF) {
            sheetToJsonOptions.dateNF = options.dateNF;
        }
        if (options.skipBlankRows) {
            sheetToJsonOptions.blankrows = false; // sheet_to_json uses `blankrows: false` to skip
        } else {
            sheetToJsonOptions.blankrows = true; // default is true to include
        }


        for (const sheetName of sheetToProcess) {
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) continue; // Should not happen if sheetToProcess is derived from workbook.SheetNames

            const jsonData: SheetData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
                worksheet,
                sheetToJsonOptions
            );
            result[sheetName] = jsonData;
        }

        // If a specific sheet was requested and found, and it's the only one,
        // you might want to return just its data array instead of the wrapper object.
        if (options.sheetNameOrIndex !== undefined && sheetToProcess.length === 1) {
            return result[sheetToProcess[0]];
        }

        return result;
    } catch (error) {
        console.error('Error converting Excel to JSON:', error);
        throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`);
    }
}