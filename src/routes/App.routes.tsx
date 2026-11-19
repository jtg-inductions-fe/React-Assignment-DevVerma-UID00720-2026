import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@components';
import { HomePage, LoginPage, NotFoundPage, ProfilePage } from '@pages';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
