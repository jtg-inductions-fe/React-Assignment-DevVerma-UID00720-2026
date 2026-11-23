import { useEffect } from 'react';

import { Box, Container } from '@mui/material';

import { Outlet } from 'react-router-dom';

import { Navbar } from '@containers';
import { getStoredSession, useAppDispatch, validateSession } from '@store';

export const AppLayout = () => {
    const dispatch = useAppDispatch();

    const storedSession = getStoredSession();
    const user = storedSession?.user ?? null;
    const token = storedSession?.token ?? null;

    useEffect(() => {
        if (!user || !token) return;
        void dispatch(
            validateSession({
                username: user.login.trim(),
                token: token.trim(),
            }),
        );
    }, [dispatch, user, token]);

    return (
        <Box>
            <Navbar />
            <Box component="main">
                <Container maxWidth="lg">
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};
