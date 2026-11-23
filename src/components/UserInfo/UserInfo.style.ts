import { styled } from '@mui/material';
import { Avatar, Card, CardContent, Chip, Typography } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
    flexShrink: 0,
    borderRadius: theme.spacing(3),
    borderColor: theme.palette.divider,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2],
    },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 64,
    height: 64,
    border: '2px solid',
    borderColor: theme.palette.divider,
}));

export const StyledLogin = styled(Typography)({
    color: 'text.primary',
});

export const StyledChip = styled(Chip)(({ theme }) => ({
    marginTop: theme.spacing(0.75),
    fontWeight: 500,
    borderRadius: theme.spacing(1.5),
}));
