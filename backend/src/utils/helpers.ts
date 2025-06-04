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

  const normalizedDateString = dateString.replace(/\\\//g, '/');
  const inputFormat = "MM/dd/yyyy";
  const parsedDate = parse(normalizedDateString, inputFormat, new Date());
  if (!isValid(parsedDate)) {
    console.warn(`Invalid date string for conversion: "${dateString}" (normalized to: "${normalizedDateString}")`);
    return null; // Or throw an error, depending on desired behavior
  }
  const outputFormat = "yyyy-MM-dd";
  return format(parsedDate, outputFormat);
}
