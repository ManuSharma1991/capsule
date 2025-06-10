import { Request, Response } from 'express';
import * as caseService from './cases.service';
import { CaseInput } from './cases.validation';

export const addCase = async (req: Request, res: Response) => {
  const caseData: CaseInput = req.body;
  const result = await caseService.createCase(caseData);
  return res.status(201).json(result);
};

export const getCases = async (_req: Request, res: Response) => {
  try {
    const cases = await caseService.fetchCases();
    return res.status(200).json(cases);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
