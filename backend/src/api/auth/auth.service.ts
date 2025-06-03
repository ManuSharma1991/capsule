// Placeholder for backend/src/api/auth/auth.service.ts - Created by scaffold script
import { usersTable } from "../../db/schema/main";

import { prodDb } from '../../db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from './auth.validation';
import { EmailExistsError, UserExistsError } from "../../middleware/appError";
import { AUTH_ERROR_CODES } from "../../utils/constants";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (input: RegisterInput) => {
    const existingUser = await prodDb.select().from(usersTable).where(eq(usersTable.empId, input.empId));
    if (existingUser.length > 0) {
        throw new UserExistsError(
            'User already exists with this employee ID',
            AUTH_ERROR_CODES.USER_ALREADY_EXISTS_EMP_ID // Explicitly pass the code
        );
    }

    const existingUserByEmail = await prodDb.select().from(usersTable).where(eq(usersTable.email, input.email));
    if (existingUserByEmail.length > 0) {
        throw new EmailExistsError( // Uses its default message and code
            'An account with this email already exists.' // You can override the message if needed
        );
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    await prodDb.insert(usersTable).values({
        name: input.name,
        empId: input.empId,
        email: input.email,
        password: hashedPassword, // not defined in schema but assuming you will extend it
    });
};

export const loginUser = async (input: LoginInput) => {
    const user = await prodDb.select().from(usersTable).where(eq(usersTable.empId, input.empId));
    if (user.length === 0) throw new Error('Invalid employee ID or password');

    const match = await bcrypt.compare(input.password, (user[0]).password);
    if (!match) throw new Error('Invalid employee ID or password');

    const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { empId: user[0].empId, name: user[0].name, email: user[0].email } };
};