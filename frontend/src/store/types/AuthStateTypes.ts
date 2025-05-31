
export interface AuthStateTypes {
    isAuthenticated: boolean;
    user: {
        empId: string;
        email: string;
        name: string;
    };
    token: string;
}