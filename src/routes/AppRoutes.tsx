import { Route, Routes } from 'react-router-dom';

import HomePage from '@pages/HomePage/HomePage';
import LoginPage from '@pages/LoginPage/LoginPage';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';

const AppRoutes = () => (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );

export default AppRoutes;
