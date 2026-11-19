import {
    Alert,
    CircularProgress,
    Container,
    Snackbar,
    Stack,
    Typography,
} from '@mui/material';

import { SearchBar, UserResultsCard } from '@components';

import { GitHubSearchResponse } from '@api';

interface Props {
    searchValue: string;
    onSearchChange: (value: string) => void;
    results: GitHubSearchResponse | null;
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
        <Stack alignItems="center" spacing={3}>
            <Typography variant="h2" component="h1" align="center">
                Find GitHub Users
            </Typography>

            <Typography
                variant="subtitle1"
                color="text.secondary"
                align="center"
            >
                Search GitHub and explore developer profiles.
            </Typography>

            <Stack alignItems="center" sx={{ width: '100%', mt: 2 }}>
                <SearchBar
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder="Search GitHub users"
                />
            </Stack>
        </Stack>

        {status === 'loading' && (
            <Stack alignItems="center" justifyContent="center" sx={{ mt: 5 }}>
                <CircularProgress />
            </Stack>
        )}

        {status === 'succeeded' && results && hasQuery && (
            <Typography color="text.secondary" align="center" sx={{ mt: 5 }}>
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
