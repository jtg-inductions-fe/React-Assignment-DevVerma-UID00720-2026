import { useEffect, useRef, useState } from 'react';

import { USER_TOKEN_STORAGE_KEY } from '@constant';
import { useAppSelector } from '@store';

import { ProfileComponent } from './Profile.component';

import { getSuggestedGitHubUsers, type GitHubUser } from '@api/githubApi';

const SUGGESTION_BATCH_SIZE = 30;
const SUGGESTION_DISPLAY_COUNT = 3;
const PREFETCH_THRESHOLD = 3 * SUGGESTION_DISPLAY_COUNT;

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
            localStorage.getItem(USER_TOKEN_STORAGE_KEY) || '',
            nextCursor,
            SUGGESTION_BATCH_SIZE,
            signal,
        );

        if (fetchedUsers.length === 0) break;

        const lastFetchedUserId = fetchedUsers[fetchedUsers.length - 1].id;

        if (nextCursor !== undefined && lastFetchedUserId <= nextCursor) break;

        nextCursor = lastFetchedUserId;

        const filteredUsers = fetchedUsers.filter(
            (user) => user.id !== excludedUserId,
        );

        availableUsers.push(...filteredUsers);
    }

    return { users: availableUsers, cursor: nextCursor };
};

export const ProfileContainer = () => {
    const [suggestions, setSuggestions] = useState<GitHubUser[]>([]);
    const [suggestionQueue, setSuggestionQueue] = useState<GitHubUser[]>([]);
    const [lastUserId, setLastUserId] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const prefetchingRef = useRef(false);

    const user = useAppSelector((state) => state.auth.user);

    const handleRefresh = async () => {
        if (!user) return;
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
        if (!user) return;
        setError(null);

        if (suggestionQueue.length > 0) {
            const nextUser = suggestionQueue[0];

            setSuggestions((current) =>
                current.map((s) => (s.id === userId ? nextUser : s)),
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
                setSuggestions((current) =>
                    current.map((s) => (s.id === userId ? nextUser : s)),
                );
            } else {
                setSuggestions((current) =>
                    current.filter((s) => s.id !== userId),
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

    const handleErrorClose = () => setError(null);

    useEffect(() => {
        if (!user) return;

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

    useEffect(() => {
        if (!user || loading) return;
        if (suggestionQueue.length >= PREFETCH_THRESHOLD) return;
        if (prefetchingRef.current) return;

        prefetchingRef.current = true;
        const controller = new AbortController();

        const prefetch = async () => {
            try {
                const fetched = await getSuggestedGitHubUsers(
                    localStorage.getItem(USER_TOKEN_STORAGE_KEY) || '',
                    lastUserId,
                    SUGGESTION_BATCH_SIZE,
                    controller.signal,
                );

                if (fetched.length === 0) return;

                const nextCursor = fetched[fetched.length - 1].id;
                const filtered = fetched.filter((u) => u.id !== user.id);

                setSuggestionQueue((prev) => [...prev, ...filtered]);
                setLastUserId(nextCursor);
            } catch {
                // prefetch failure shouldn't show an error
            } finally {
                prefetchingRef.current = false;
            }
        };

        void prefetch();

        return () => controller.abort();
    }, [suggestionQueue.length, user, loading, lastUserId]);

    if (!user) return null;

    return (
        <ProfileComponent
            user={user}
            suggestions={suggestions}
            loading={loading}
            error={error}
            onRefresh={() => void handleRefresh()}
            onRemove={(id) => void handleRemove(id)}
            onErrorClose={handleErrorClose}
        />
    );
};
