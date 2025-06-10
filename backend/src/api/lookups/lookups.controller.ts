import { Request, Response, NextFunction } from 'express';
import lookupsService from './lookups.service';
import { GetCasesByHearingDateInput, GetCasesByCaseNoInput } from './lookups.validation';

class LookupsController {
    public async getCasesByHearingDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { hearingDate } = req.query as GetCasesByHearingDateInput;
            const cases = await lookupsService.fetchCasesByHearingDate(hearingDate);
            res.status(200).json(cases);
        } catch (error) {
            next(error);
        }
    }

    public async getCasesByCaseNo(req: Request, res: Response, next: NextFunction) {
        try {
            const { caseNo } = req.params as GetCasesByCaseNoInput;
            const cases = await lookupsService.fetchCasesByCaseNo(caseNo);
            res.status(200).json(cases);
        } catch (error) {
            next(error);
        }
    }
}

export default new LookupsController();
