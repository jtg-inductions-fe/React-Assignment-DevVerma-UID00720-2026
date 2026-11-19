import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { UserMenu } from '@components';
import { logoutUser, useAppDispatch, useAppSelector } from '@store';

export const Navbar = () => {
    const NAVBAR_ACTIONS = ['Profile', 'Logout'] as const;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isLoggedIn = Boolean(user);

    const handleMenuItemClick = (action: string) => {
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
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
            <Container>
                <Toolbar component="nav" disableGutters sx={{ gap: 2 }}>
                    <Typography
                        component={RouterLink}
                        to="/"
                        variant="h3"
                        color="primary.main"
                        noWrap
                        sx={{ textDecoration: 'none' }}
                    >
                        GitHub Finder
                    </Typography>
                    <Box ml="auto">
                        {isLoggedIn ? (
                            <UserMenu
                                user={user}
                                actions={NAVBAR_ACTIONS}
                                onMenuItemClick={handleMenuItemClick}
                            />
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
