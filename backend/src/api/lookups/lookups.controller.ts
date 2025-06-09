import { Request, Response, NextFunction } from 'express';
import lookupsService from './lookups.service';
import ApiError from '../../utils/apiError';

class LookupsController {
    public async getCasesByHearingDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { hearingDate } = req.query;

            if (!hearingDate || typeof hearingDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(hearingDate)) {
                throw new ApiError(400, 'Invalid or missing hearingDate. Please provide in YYYY-MM-DD format.');
            }

            const cases = await lookupsService.fetchCasesByHearingDate(hearingDate);
            res.status(200).json(cases);
        } catch (error) {
            next(error);
        }
    }
}

export default new LookupsController();
