import type { User } from "./user";

export interface LoginSuccessResponse {
    user: User;
    token: string;
    message?: string; // Optional success message
}