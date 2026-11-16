import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@store';
import { logoutUser } from '@store/auth/authSlice';

import { NavbarComponent } from './Navbar.component';
import { NavbarAction } from './NavLinks.component';

export const Navbar = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isLoggedIn = Boolean(user);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuItemClick = (action: NavbarAction) => {
        handleCloseUserMenu();

        switch (action) {
            case 'Profile':
                void navigate('/profile');
                break;
            case 'Logout':
                void dispatch(logoutUser());
                void navigate('/');
                break;
        }
    };

    return (
        <NavbarComponent
            user={user}
            isLoggedIn={isLoggedIn}
            anchorElUser={anchorElUser}
            onOpenUserMenu={handleOpenUserMenu}
            onCloseUserMenu={handleCloseUserMenu}
            onMenuItemClick={handleMenuItemClick}
        />
    );
};
