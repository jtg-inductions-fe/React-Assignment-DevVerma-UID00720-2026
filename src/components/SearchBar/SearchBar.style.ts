import { styled, TextField } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 600,
    '& .MuiOutlinedInput-root': {
        borderRadius: 10,
        backgroundColor: theme.palette.background.paper,
    },
}));
