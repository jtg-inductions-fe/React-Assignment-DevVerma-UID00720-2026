import { Box, Container } from '@mui/material';

import { Outlet } from 'react-router-dom';

import { Navbar } from '@containers';

export const AppLayout = () => (
    <Box>
        <Navbar />
        <Box component="main">
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </Box>
    </Box>
);
