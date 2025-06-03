import { Router } from 'express';
import { addCase, getCases } from './cases.controller';
import { tryCatchWrapper } from '../../utils/helpers';

const caseRoutes = Router();

caseRoutes.post('/addCase', tryCatchWrapper(addCase));
caseRoutes.get('/getCases', getCases);

export default caseRoutes;
