import type { AppStateTypes } from "../types/AppStateTypes";

export const selectIsAuthenticated = (state: AppStateTypes): boolean => {
    return state.auth.isAuthenticated;
}

export const selectUser = (state: AppStateTypes) => {
    return state.auth.user;
}

export const selectToken = (state: AppStateTypes): string => {
    return state.auth.token;
}