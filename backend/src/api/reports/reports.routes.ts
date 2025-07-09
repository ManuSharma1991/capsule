import { Router } from 'express';
import { generateCauselistReport } from './reports.controller';

const router = Router();

router.post('/causelist', generateCauselistReport);

export default router;
