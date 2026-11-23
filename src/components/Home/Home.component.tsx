import { CircularProgress, Stack, Typography } from '@mui/material';

import { GitHubSearchResponse } from '@api';
import { AlertSnackbar, SearchBar, UserResultsCard } from '@components';

interface HomeProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    results: GitHubSearchResponse | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    hasQuery: boolean;
    onSnackbarClose: () => void;
}

export const HomeComponent = (props: HomeProps) => {
    const {
        searchValue,
        onSearchChange,
        results,
        status,
        error,
        hasQuery,
        onSnackbarClose,
    } = props;

    return (
        <Stack alignItems="center" spacing={3} sx={{ py: 5 }}>
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

            {status === 'loading' && (
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 5 }}
                >
                    <CircularProgress />
                </Stack>
            )}

            {status === 'succeeded' && results && hasQuery && (
                <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 5 }}
                >
                    Found {results.total_count.toLocaleString()} matching users.
                </Typography>
            )}

            <UserResultsCard
                users={results?.items ?? []}
                hasSearched={status === 'succeeded' && hasQuery}
            />

            <AlertSnackbar
                open={Boolean(error)}
                message={error}
                onClose={onSnackbarClose}
            />
        </Stack>
    );
};
