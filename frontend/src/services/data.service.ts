import type { AxiosResponse } from "axios";
import axiosInstance from "./axios.instance";
import type { Case } from '../types/cases'; // Import Case type
import type { MainTableRowData } from '../types/dashboard'; // Import MainTableRowData type
import type { LoginPayload } from "../types/loginPayload";
import type { LoginSuccessResponse } from "../types/LoginSuccessResponse";
import type { RegisterPayload } from "../types/registerPayload";


//Authentication service methods (these should ideally be in a separate auth.service.ts)
const register = (data: RegisterPayload) => {
    return axiosInstance.post('/auth/register', data);
};

const login = (data: LoginPayload) => {
    return axiosInstance.post<LoginPayload, AxiosResponse<LoginSuccessResponse>>('/auth/login', data);
}

const casesByCaseNo = (caseNumber: string): Promise<AxiosResponse<Case>> => {
    return axiosInstance.get(`/lookups/casesByCaseNo/${encodeURIComponent(caseNumber)}`);
};

const casesByHearingDate = (date: string): Promise<AxiosResponse<MainTableRowData[]>> => {
    return axiosInstance.get(`lookups/casesByHearingDate?hearingDate=${date}`);
};

export const dataService = {
    register,
    login,
    casesByCaseNo,
    casesByHearingDate, // Add the new method
};
