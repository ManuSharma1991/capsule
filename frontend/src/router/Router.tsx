// frontend/src/router/Router.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';

const AppRouter = () => {
    const appBaseName = '/';

    return (
        <BrowserRouter basename={appBaseName}>
            <Routes>
                <Route > {/* Optional: MainLayout for header, sidebar, footer */}
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* <Route path="/cases" element={<CaseListPage />} /> */}
                    {/* <Route path="/cases/:caseId" element={<CaseDetailPage />} /> */}
                    {/* Add other application routes here */}
                </Route>

                {/* Catch-all for 404 Not Found - good practice */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
                <Route path="*" element={<Navigate replace to="/home" />} /> {/* Or redirect to home */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;