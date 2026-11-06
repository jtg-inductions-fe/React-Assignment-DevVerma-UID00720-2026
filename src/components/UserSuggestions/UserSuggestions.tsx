import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import { type GitHubUser } from '@api/githubApi';
import UserInfo from '@components/UserInfo/UserInfo';

interface UserSuggestionsProps {
    suggestions: GitHubUser[];
    loading: boolean;
    onRefresh: () => void;
    onRemove: (userId: number) => void;
}

const UserSuggestions = ({
    suggestions,
    loading,
    onRefresh,
    onRemove,
}: UserSuggestionsProps) => (
    <Card
        variant="outlined"
        sx={{
            width: '100%',
            maxWidth: 850,
            mx: 'auto',
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
        }}
    >
        <Stack spacing={2}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h6">Suggested Accounts</Typography>

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={onRefresh}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                    }}
                >
                    Refresh
                </Button>
            </Stack>

            {loading && suggestions.length === 0 ? (
                <Stack alignItems="center" spacing={1} sx={{ py: 4 }}>
                    <CircularProgress size={28} />

                    <Typography variant="body2" color="text.secondary">
                        Loading suggestions...
                    </Typography>
                </Stack>
            ) : suggestions.length === 0 ? (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 3 }}
                >
                    No more suggestions available.
                </Typography>
            ) : (
                <Stack spacing={1.5}>
                    {suggestions.map((user) => (
                        <Stack
                            key={user.id}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <UserInfo user={user} />
                            </Box>

                            <IconButton
                                size="small"
                                aria-label={`Remove ${user.login} from suggestions`}
                                onClick={() => onRemove(user.id)}
                                disabled={loading}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    ))}
                </Stack>
            )}

            {loading && suggestions.length > 0 && (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                >
                    <CircularProgress size={16} />

                    <Typography variant="caption" color="text.secondary">
                        Loading more suggestions...
                    </Typography>
                </Stack>
            )}
        </Stack>
    </Card>
);

export default UserSuggestions;
