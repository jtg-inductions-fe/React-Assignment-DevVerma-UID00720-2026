import { Stack } from '@mui/material';

import { type GitHubUser } from '@api';
import { AlertSnackbar, UserProfile, UserSuggestions } from '@components';

interface ProfileProps {
    user: GitHubUser;
    suggestions: GitHubUser[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onRemove: (userId: number) => void;
    onErrorClose: () => void;
}

export const ProfileComponent = (props: ProfileProps) => {
    const {
        user,
        suggestions,
        loading,
        error,
        onRefresh,
        onRemove,
        onErrorClose,
    } = props;

    return (
        <Stack spacing={4} maxWidth="md" sx={{ mx: 'auto', py: 5 }}>
            <UserProfile user={user} />

            <UserSuggestions
                suggestions={suggestions}
                loading={loading}
                onRefresh={onRefresh}
                onRemove={onRemove}
            />

            <AlertSnackbar
                open={Boolean(error)}
                message={error}
                onClose={onErrorClose}
            />
        </Stack>
    );
};
