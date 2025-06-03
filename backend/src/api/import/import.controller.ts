import { Request, Response } from 'express';
import * as importService from './import.service';
import { validateImportCauseListArrayPayload } from './import.validation';
import logger from '../../utils/logger';

export const importCases = async (req: Request, res: Response) => {
  const validation = validateImportCauseListArrayPayload(req.body);
  if (!validation.success) {
    logger.error('Validation failed for case payload:', validation.error);
    return res.status(400).json({ error: validation.error });
  } else {
    console.log('Validation successful for case payload:', validation.data);
    const result = validation.data && (await importService.importCases(validation.data));
    return res.status(201).json(result);
  }
};

export const getCases = async (_req: Request, res: Response) => {
  const cases = await importService.fetchCases();
  return res.status(200).json(cases);
};
