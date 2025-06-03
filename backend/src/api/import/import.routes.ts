import { Router } from 'express';
import { tryCatchWrapper } from '../../utils/helpers';
import { importCases } from './import.controller';

const importRoutes = Router();

importRoutes.post('/importCauselistData', tryCatchWrapper(importCases));

export default importRoutes;