import { useEffect } from 'react';

import { Box, Container } from '@mui/material';

import { Outlet } from 'react-router-dom';

import { Navbar } from '@containers';
import {
    selectAuthToken,
    selectAuthUser,
    useAppDispatch,
    useAppSelector,
    validateSession,
} from '@store';

export const AppLayout = () => {
    const dispatch = useAppDispatch();

    const userName = useAppSelector(selectAuthUser)?.login ?? null;
    const token = useAppSelector(selectAuthToken) ?? null;

    useEffect(() => {
        if (!userName || !token) return;
        void dispatch(
            validateSession({
                username: userName.trim(),
                token: token.trim(),
            }),
        );
    }, [dispatch, userName, token]);

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
