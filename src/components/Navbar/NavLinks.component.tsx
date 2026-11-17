import {
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

const NAVBAR_ACTIONS = ['Profile', 'Logout'] as const;
export type NavbarAction = (typeof NAVBAR_ACTIONS)[number];

interface Props {
    user: { avatar_url?: string; login?: string } | null;
    isLoggedIn: boolean;
    anchorElUser: HTMLElement | null;
    onOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
    onCloseUserMenu: () => void;
    onMenuItemClick: (action: NavbarAction) => void;
}

export const NavLinks = ({
    user,
    isLoggedIn,
    anchorElUser,
    onOpenUserMenu,
    onCloseUserMenu,
    onMenuItemClick,
}: Props) => {
    if (!isLoggedIn) {
        return (
            <Button component={RouterLink} to="/login" variant="contained">
                Login
            </Button>
        );
    }

    return (
        <Box>
            <Tooltip title="Open settings">
                <IconButton
                    onClick={onOpenUserMenu}
                    sx={{ p: 0 }}
                    aria-label="Open profile menu"
                    aria-haspopup="menu"
                    aria-expanded={Boolean(anchorElUser)}
                    aria-controls={anchorElUser ? 'menu-appbar' : undefined}
                >
                    <Avatar
                        src={user?.avatar_url}
                        alt={user?.login ?? 'Profile'}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                sx={{ mt: 10 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={onCloseUserMenu}
            >
                {NAVBAR_ACTIONS.map((action) => (
                    <MenuItem
                        key={action}
                        onClick={() => onMenuItemClick(action)}
                    >
                        <Typography sx={{ textAlign: 'center' }}>
                            {action}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};
