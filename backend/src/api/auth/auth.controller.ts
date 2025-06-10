import { Request, Response } from 'express';
import * as authService from './auth.service';
import { LoginInput, RegisterInput } from './auth.validation';

export const register = async (req: Request, res: Response) => {
  const registerData: RegisterInput = req.body;
  await authService.registerUser(registerData);
  return res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response) => {
  const loginData: LoginInput = req.body;
  const result = await authService.loginUser(loginData);
  return res.status(200).json(result);
};
