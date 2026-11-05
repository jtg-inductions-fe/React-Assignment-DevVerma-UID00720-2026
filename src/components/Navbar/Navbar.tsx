import { useState } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';

import { logoutUser } from '@store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

const settings = ['Profile', 'Logout'];

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const isLoggedIn = Boolean(user);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();
        await dispatch(logoutUser());
        void navigate('/');
    };

    const handleMenuItemClick = (setting: string) => {
        handleCloseUserMenu();

        if (setting === 'Profile') {
            void navigate('/profile');
        } else if (setting === 'Logout') {
            void handleLogout();
        }
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ gap: 2 }}>
                    <Typography
                        component={RouterLink}
                        to="/"
                        variant="h3"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        GitHub Finder
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {!isLoggedIn ? (
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="contained"
                        >
                            Login
                        </Button>
                    ) : (
                        <Box>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                    aria-label="Open profile menu"
                                >
                                    <Avatar
                                        src={user?.avatar_url}
                                        alt={user?.login ?? 'Profile'}
                                    />
                                </IconButton>
                            </Tooltip>

                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() =>
                                            handleMenuItemClick(setting)
                                        }
                                    >
                                        <Typography
                                            sx={{ textAlign: 'center' }}
                                        >
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
