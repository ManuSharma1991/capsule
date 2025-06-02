// frontend/src/services/api.ts (or axiosService.ts)
import axios from 'axios';

// The base path for all API endpoints.
// This should match the prefix used in your Vite proxy and Express API routes.
const API_BASE_PATH = '/api'; // Or whatever prefix you use

const axiosInstance = axios.create({
    baseURL: API_BASE_PATH, // e.g., requests will go to /api/users, /api/health
    timeout: 10000, // Optional: set a timeout for requests
    headers: { 'Content-Type': 'application/json' }, // Optional: default headers
});

// --- Optional: Interceptors ---
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: Add an auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Starting Request', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // You can process data here before it's passed to your .then()
        console.log('Response Received:', response.status, response.data);
        return response; // Always return response or response.data
    },
    (error) => {
        console.error('Response Error Interceptor:', error.response?.data || error.message);
        // Handle global errors like 401 (Unauthorized), 403 (Forbidden)
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                // e.g., redirect to login, clear token
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error); // Important to reject the promise so .catch() blocks work
    }
);

export default axiosInstance;