import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@components';
import { HomePage, LoginPage, NotFoundPage, ProfilePage } from '@pages';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            }
        />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
