import { Router } from 'express';
import { login, register } from './auth.controller';
import { tryCatchWrapper } from '../../utils/helpers';

const authRoutes = Router();

authRoutes.post('/register', tryCatchWrapper(register));
authRoutes.post('/login', tryCatchWrapper(login));

export default authRoutes;
