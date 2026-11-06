import { Route, Routes } from 'react-router-dom';

import { HomePage, LoginPage, NotFoundPage, ProfilePage } from '@pages';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);
