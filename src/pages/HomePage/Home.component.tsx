import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Snackbar,
    Typography,
} from '@mui/material';

import { SearchBar, UserResultsCard } from '@components';

import { GitHubUser } from '@api/githubApi';

interface Props {
    searchValue: string;
    onSearchChange: (value: string) => void;
    results: { total_count: number; items: GitHubUser[] } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    hasQuery: boolean;
    onSnackbarClose: () => void;
}

export const HomeComponent = ({
    searchValue,
    onSearchChange,
    results,
    status,
    error,
    hasQuery,
    onSnackbarClose,
}: Props) => (
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
                <SearchBar value={searchValue} onChange={onSearchChange} />
            </Box>
        </Box>

        {status === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
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

        <UserResultsCard
            users={results?.items ?? []}
            hasSearched={status === 'succeeded' && hasQuery}
        />

        <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={onSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={onSnackbarClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {error}
            </Alert>
        </Snackbar>
    </Container>
);
