import type { AxiosResponse } from "axios";
import type { LoginPayload } from "../types/loginPayload";
import type { LoginSuccessResponse } from "../types/LoginSuccessResponse";
import type { RegisterPayload } from "../types/registerPayload";
import axiosInstance from "./axios.instance";

//Authentication service methods

const register = (data: RegisterPayload) => {
    return axiosInstance.post('/auth/register', data);
};

const login = (data: LoginPayload) => {
    return axiosInstance.post<LoginPayload, AxiosResponse<LoginSuccessResponse>>('/auth/login', data);
}



export const dataService = {
    register,
    login,
    // Add other service methods as needed
    // For example, you can add methods for login, fetching data, etc.
    // login: () => axiosInstance.post('/login'),
    // fetchData: () => axiosInstance.get('/data'),
};