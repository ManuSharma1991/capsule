import { Request, Response } from 'express';
import * as importService from './import.service';
import {
  validateImportCauseListArrayPayload,
  validateImportScraperDataArrayPayload,
} from './import.validation';
import logger from '../../utils/logger';

export const importCases = async (req: Request, res: Response) => {
  const { data: validData, errors } = validateImportCauseListArrayPayload(req.body);

  if (validData.length === 0 && errors.length > 0) {
    logger.warn('No valid cases to import. All rows failed validation.', { errors });
    return res.status(400).json({
      message: 'No valid cases could be imported. All rows failed validation.',
      errors: errors,
    });
  }

  if (validData.length === 0 && errors.length === 0) {
    logger.warn('Empty payload received for import.');
    return res.status(400).json({
      message: 'Empty payload received. No cases to import.',
    });
  }

  try {
    const importResult = await importService.importCases(validData);
    logger.info(
      `Successfully imported ${validData.length} cases. Skipped ${errors.length} invalid rows.`
    );
    return res.status(201).json({
      message: `Import process completed. Successfully imported ${validData.length} cases.`,
      importedCount: validData.length,
      skippedCount: errors.length,
      skippedErrors: errors,
      details: importResult, // Include details from the service if any
    });
  } catch (error) {
    logger.error('Error during import process:', error);
    return res.status(500).json({
      message: 'An error occurred during the import process.',
      error: error instanceof Error ? error.message : 'Unknown error',
      skippedCount: errors.length,
      skippedErrors: errors,
    });
  }
};

export const importScraperCases = async (req: Request, res: Response) => {
  const { data: validData, errors } = validateImportScraperDataArrayPayload(req.body);

  if (validData.length === 0 && errors.length > 0) {
    logger.warn('No valid cases to import. All rows failed validation.', { errors });
    return res.status(400).json({
      message: 'No valid cases could be imported. All rows failed validation.',
      errors: errors,
    });
  }

  if (validData.length === 0 && errors.length === 0) {
    logger.warn('Empty payload received for import.');
    return res.status(400).json({
      message: 'Empty payload received. No cases to import.',
    });
  }

  try {
    const importResult = await importService.importScraperData(validData);
    logger.info(
      `Successfully imported ${validData.length} cases. Skipped ${errors.length} invalid rows.`
    );
    return res.status(201).json({
      message: `Import process completed. Successfully imported ${validData.length} cases.`,
      importedCount: validData.length,
      skippedCount: errors.length,
      skippedErrors: errors,
      details: importResult, // Include details from the service if any
    });
  } catch (error) {
    logger.error('Error during import process:', error);
    return res.status(500).json({
      message: 'An error occurred during the import process.',
      error: error instanceof Error ? error.message : 'Unknown error',
      skippedCount: errors.length,
      skippedErrors: errors,
    });
  }
};

export const getCases = async (_req: Request, res: Response) => {
  const cases = await importService.fetchCases();
  return res.status(200).json(cases);
};
