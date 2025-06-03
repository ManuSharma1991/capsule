import { format, isValid, parse } from 'date-fns';
import { RequestHandler } from 'express';

export const tryCatchWrapper = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Converts a date string from DD/MM/YYYY (or DD\/MM\/YYYY) format
 * to YYYY-MM-DD format.
 *
 * @param dateString The date string to convert (e.g., "05/12/2025" or "05\/12\/2025").
 * @returns The date string in YYYY-MM-DD format, or null if the input is invalid or empty.
 */
export const convertToYYYYMMDD = (dateString: string | null | undefined): string | null => {
  if (!dateString) {
    return null; // Handle null, undefined, or empty string input
  }

  // 1. Normalize: Remove potential escape characters for slashes
  const normalizedDateString = dateString.replace(/\\\//g, '/');

  // 2. Parse: Convert string to Date object using DD/MM/YYYY format
  // 'dd' for day, 'MM' for month, 'yyyy' for year.
  const inputFormat = "MM/dd/yyyy";
  const parsedDate = parse(normalizedDateString, inputFormat, new Date());
  // The `new Date()` here is a reference date, primarily used if the format string
  // doesn't specify all date parts (e.g., if you only parse "dd/MM").
  // For "dd/MM/yyyy", it's less critical but good practice.

  // 3. Validate: Check if the parsed date is valid
  if (!isValid(parsedDate)) {
    console.warn(`Invalid date string for conversion: "${dateString}" (normalized to: "${normalizedDateString}")`);
    return null; // Or throw an error, depending on desired behavior
  }

  // 4. Format: Convert the Date object to YYYY-MM-DD string
  const outputFormat = "yyyy-MM-dd";
  return format(parsedDate, outputFormat);
}
