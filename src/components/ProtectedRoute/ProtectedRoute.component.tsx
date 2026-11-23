import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@constants';
import { selectAuthUser, useAppSelector } from '@store';

export const ProtectedRoute = () => {
    const user = useAppSelector(selectAuthUser);

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};
