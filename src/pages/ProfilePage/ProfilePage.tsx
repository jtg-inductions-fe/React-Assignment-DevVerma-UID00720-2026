import { useEffect, useState } from 'react';

import { Alert, Container, Snackbar, Stack } from '@mui/material';

import { getSuggestedGitHubUsers, type GitHubUser } from '@api/githubApi';
import UserProfile from '@components/UserProfile/UserProfile';
import UserSuggestions from '@components/UserSuggestions/UserSuggestions';
import { useAppSelector } from '@store/hooks';

const SUGGESTION_BATCH_SIZE = 30;
const SUGGESTION_DISPLAY_COUNT = 3;

interface AvailableSuggestions {
    users: GitHubUser[];
    cursor: number | undefined;
}

const getAvailableSuggestions = async (
    requiredCount: number,
    currentQueue: GitHubUser[],
    cursor: number | undefined,
    excludedUserId: number,
    signal?: AbortSignal,
): Promise<AvailableSuggestions> => {
    const availableUsers = [...currentQueue];
    let nextCursor = cursor;

    while (availableUsers.length < requiredCount) {
        const fetchedUsers = await getSuggestedGitHubUsers(
            nextCursor,
            SUGGESTION_BATCH_SIZE,
            signal,
        );

        if (fetchedUsers.length === 0) {
            break;
        }

        const lastFetchedUserId = fetchedUsers[fetchedUsers.length - 1].id;

        if (nextCursor !== undefined && lastFetchedUserId <= nextCursor) {
            break;
        }

        nextCursor = lastFetchedUserId;

        const filteredUsers = fetchedUsers.filter(
            (user) => user.id !== excludedUserId,
        );

        availableUsers.push(...filteredUsers);
    }

    return {
        users: availableUsers,
        cursor: nextCursor,
    };
};

const ProfilePage = () => {
    const user = useAppSelector((state) => state.auth.user);

    const [suggestions, setSuggestions] = useState<GitHubUser[]>([]);
    const [suggestionQueue, setSuggestionQueue] = useState<GitHubUser[]>([]);
    const [lastUserId, setLastUserId] = useState<number | undefined>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const controller = new AbortController();

        const loadSuggestions = async () => {
            try {
                const result = await getAvailableSuggestions(
                    SUGGESTION_DISPLAY_COUNT,
                    [],
                    undefined,
                    user.id,
                    controller.signal,
                );

                setSuggestions(result.users.slice(0, SUGGESTION_DISPLAY_COUNT));

                setSuggestionQueue(
                    result.users.slice(SUGGESTION_DISPLAY_COUNT),
                );

                setLastUserId(result.cursor);
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Unable to load suggestions.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadSuggestions();

        return () => {
            controller.abort();
        };
    }, [user]);

    if (!user) {
        return null;
    }

    const handleRefresh = async () => {
        setError(null);

        if (suggestionQueue.length >= SUGGESTION_DISPLAY_COUNT) {
            setSuggestions(suggestionQueue.slice(0, SUGGESTION_DISPLAY_COUNT));

            setSuggestionQueue(suggestionQueue.slice(SUGGESTION_DISPLAY_COUNT));

            return;
        }

        setLoading(true);

        try {
            const result = await getAvailableSuggestions(
                SUGGESTION_DISPLAY_COUNT,
                suggestionQueue,
                lastUserId,
                user.id,
            );

            setSuggestions(result.users.slice(0, SUGGESTION_DISPLAY_COUNT));

            setSuggestionQueue(result.users.slice(SUGGESTION_DISPLAY_COUNT));

            setLastUserId(result.cursor);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to refresh suggestions.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (userId: number) => {
        setError(null);

        if (suggestionQueue.length > 0) {
            const nextUser = suggestionQueue[0];

            setSuggestions((currentSuggestions) =>
                currentSuggestions.map((suggestion) =>
                    suggestion.id === userId ? nextUser : suggestion,
                ),
            );

            setSuggestionQueue(suggestionQueue.slice(1));

            return;
        }

        setLoading(true);

        try {
            const result = await getAvailableSuggestions(
                1,
                suggestionQueue,
                lastUserId,
                user.id,
            );

            const nextUser = result.users[0];

            if (nextUser) {
                setSuggestions((currentSuggestions) =>
                    currentSuggestions.map((suggestion) =>
                        suggestion.id === userId ? nextUser : suggestion,
                    ),
                );
            } else {
                setSuggestions((currentSuggestions) =>
                    currentSuggestions.filter(
                        (suggestion) => suggestion.id !== userId,
                    ),
                );
            }

            setSuggestionQueue(result.users.slice(1));
            setLastUserId(result.cursor);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to replace suggestion.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
            <Stack spacing={4} sx={{ maxWidth: 'md', mx: 'auto' }}>
                <UserProfile user={user} />

                <UserSuggestions
                    suggestions={suggestions}
                    loading={loading}
                    onRefresh={() => {
                        void handleRefresh();
                    }}
                    onRemove={(userId) => {
                        void handleRemove(userId);
                    }}
                />
            </Stack>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProfilePage;
