import { type SyntheticEvent, useEffect, useState } from 'react';

import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Snackbar,
    Typography,
} from '@mui/material';

import SearchBar from '@components/SearchBar/SearchBar';
import {
    clearSearchError,
    clearSearchResults,
    searchGitHubUsers,
} from '@store/githubSearch/githubSearchSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

const HomePage = () => {
    const [searchValue, setSearchValue] = useState('');

    const dispatch = useAppDispatch();

    const { results, status, error } = useAppSelector(
        (state) => state.githubSearch,
    );

    useEffect(() => {
        const query = searchValue.trim();

        dispatch(clearSearchResults());
        if (!query) {
            return;
        }

        let abortRequest: (() => void) | undefined;

        const timeoutId = window.setTimeout(() => {
            const request = dispatch(searchGitHubUsers(query));

            abortRequest = () => {
                request.abort();
            };
        }, 400);

        return () => {
            window.clearTimeout(timeoutId);
            abortRequest?.();
        };
    }, [searchValue, dispatch]);

    const handleSnackbarClose = (
        _event?: SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(clearSearchError());
    };

    const hasQuery = searchValue.trim().length > 0;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 8 } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{ textAlign: 'center' }}
                >
                    Find GitHub Users
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                >
                    Search GitHub and explore developer profiles.
                </Typography>

                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <SearchBar value={searchValue} onChange={setSearchValue} />
                </Box>
            </Box>

            {status === 'loading' && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 5,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {status === 'succeeded' && results && hasQuery && (
                <Typography
                    color="text.secondary"
                    sx={{ mt: 5, textAlign: 'center' }}
                >
                    Found {results.total_count.toLocaleString()} matching users.
                </Typography>
            )}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default HomePage;
