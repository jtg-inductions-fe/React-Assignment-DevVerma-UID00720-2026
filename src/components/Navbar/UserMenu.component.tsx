import { useState } from 'react';

import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material';

interface UserMenuProps {
    user: { avatar_url?: string; login?: string } | null;
    actions: readonly string[];
    onMenuItemClick: (action: string) => void;
}

export const UserMenu = (props: UserMenuProps) => {
    const { user, actions, onMenuItemClick } = props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <Box>
            <Tooltip title="Open user menu">
                <IconButton
                    onClick={handleOpen}
                    sx={{ p: 0 }}
                    aria-label="Open user menu"
                    aria-haspopup="menu"
                    aria-expanded={Boolean(anchorEl)}
                    aria-controls={anchorEl ? 'menu-appbar' : undefined}
                >
                    <Avatar
                        src={user?.avatar_url}
                        alt={user?.login ?? 'Profile'}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {actions.map((action) => (
                    <MenuItem
                        key={action}
                        onClick={() => {
                            handleClose();
                            onMenuItemClick(action);
                        }}
                    >
                        <Typography textAlign="center">{action}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};
