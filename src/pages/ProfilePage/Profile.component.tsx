import { Alert, Container, Snackbar, Stack } from '@mui/material';

import { UserProfile, UserSuggestions } from '@components';

import { type GitHubUser } from '@api/githubApi';

interface Props {
    user: GitHubUser;
    suggestions: GitHubUser[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onRemove: (userId: number) => void;
    onErrorClose: () => void;
}

export const ProfileComponent = ({
    user,
    suggestions,
    loading,
    error,
    onRefresh,
    onRemove,
    onErrorClose,
}: Props) => (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <Stack spacing={4} sx={{ maxWidth: 'md', mx: 'auto' }}>
            <UserProfile user={user} />

            <UserSuggestions
                suggestions={suggestions}
                loading={loading}
                onRefresh={onRefresh}
                onRemove={onRemove}
            />
        </Stack>

        <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={onErrorClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                severity="error"
                onClose={onErrorClose}
                sx={{ width: '100%' }}
            >
                {error}
            </Alert>
        </Snackbar>
    </Container>
);
