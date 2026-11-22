import { Box, Button, Typography } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { ROUTES } from '@constants';

export const NotFoundPage = () => (
    <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
            404
        </Typography>

        <Typography variant="h2" sx={{ mb: 2 }}>
            Page Not Found
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Sorry, the page you&apos;re looking for doesn&apos;t exist or may
            have been moved.
        </Typography>

        <Button
            component={RouterLink}
            to={ROUTES.HOME}
            variant="contained"
            size="large"
        >
            Go to Home
        </Button>
    </Box>
);
