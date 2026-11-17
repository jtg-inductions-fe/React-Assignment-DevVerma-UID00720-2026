import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { NavLinks } from './NavLinks.component';
import { NavbarAction } from './NavLinks.component';

interface Props {
    user: { avatar_url?: string; login?: string } | null;
    isLoggedIn: boolean;
    anchorElUser: HTMLElement | null;
    onOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    onCloseUserMenu: () => void;
    onMenuItemClick: (action: NavbarAction) => void;
}

export const NavbarComponent = ({
    user,
    isLoggedIn,
    anchorElUser,
    onOpenUserMenu,
    onCloseUserMenu,
    onMenuItemClick,
}: Props) => (
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
                    sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                    }}
                >
                    GitHub Finder
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <NavLinks
                    user={user}
                    isLoggedIn={isLoggedIn}
                    anchorElUser={anchorElUser}
                    onOpenUserMenu={onOpenUserMenu}
                    onCloseUserMenu={onCloseUserMenu}
                    onMenuItemClick={onMenuItemClick}
                />
            </Toolbar>
        </Container>
    </AppBar>
);
