import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@components';
import { ROUTES } from '@constants';
import { HomePage, LoginPage, NotFoundPage, ProfilePage } from '@pages';

import { AppLayout } from '@layouts';

export const AppRoutes = () => (
    <Routes>
        <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>
    </Routes>
);
