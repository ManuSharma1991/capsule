// frontend/src/router/Router.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import { CasesPage } from '../pages/CasesPage';
import GenerateCauselistPage from '../pages/GenerateCauselistPage/GenerateCauselistPage'; // Import the new page
import MainLayout from '../components/MainLayout'; // Import the new MainLayout

const AppRouter = () => {
    const appBaseName = '/';

    return (
        <BrowserRouter basename={appBaseName}>
            <Routes>
                <Route element={<MainLayout />}> {/* Use MainLayout for common layout */}
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/cases" element={<CasesPage />} />
                    <Route path="/generate-causelist" element={<GenerateCauselistPage />} />
                    {/* <Route path="/cases/:caseId" element={<CaseDetailPage />} /> */}
                    {/* Add other application routes here */}
                </Route>

                {/* Routes without MainLayout (e.g., Auth pages) */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Catch-all for 404 Not Found - good practice */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
                <Route path="*" element={<Navigate replace to="/home" />} /> {/* Or redirect to home */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
