import { Link as RouterLink } from 'react-router-dom';

import { Box, Button, Container, Typography } from '@mui/material';

const NotFoundPage = () => (
        <Container
            maxWidth="md"
            sx={{
                py: { xs: 6, sm: 8 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh',
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
                    404
                </Typography>

                <Typography variant="h2" sx={{ mb: 2 }}>
                    Page Not Found
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Sorry, the page you&apos;re looking for doesn&apos;t exist
                    or may have been moved.
                </Typography>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="contained"
                    size="large"
                >
                    Go to Home
                </Button>
            </Box>
        </Container>
    );

export default NotFoundPage;
