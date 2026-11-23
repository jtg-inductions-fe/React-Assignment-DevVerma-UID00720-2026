import { Box, Typography } from '@mui/material';

interface StatCardProps {
    label: string;
    value: number | undefined;
}

export const StatCard = (props: StatCardProps) => {
    const { label, value } = props;
    return (
        <Box
            sx={{
                textAlign: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'action.hover',
            }}
        >
            <Typography variant="h5" fontWeight={700} color="primary">
                {(value ?? 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
};
