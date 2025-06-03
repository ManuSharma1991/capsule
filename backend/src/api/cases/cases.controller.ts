import { Request, Response } from "express";
import * as caseService from "./cases.service";
import { validateCasePayload } from "./cases.validation";
import logger from "../../utils/logger";

export const addCase = async (req: Request, res: Response) => {
    const validation = validateCasePayload(req.body);
    if (!validation.success) {
        logger.error("Validation failed for case payload:", validation.error);
        return res.status(400).json({ error: validation.error });
    }

    const result = await caseService.createCase(validation.data);
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
