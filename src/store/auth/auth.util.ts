import type { GitHubUser } from '@api';
import { USER_INFO_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from '@constants';

export const saveSession = (user: GitHubUser, token: string) => {
    localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_TOKEN_STORAGE_KEY, token);
};

export const clearSession = () => {
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
    localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
};

export const getStoredSession = (): {
    user: GitHubUser;
    token: string;
} | null => {
    try {
        const storedUser = localStorage.getItem(USER_INFO_STORAGE_KEY);
        const storedToken = localStorage.getItem(USER_TOKEN_STORAGE_KEY);

        if (!storedUser || !storedToken) return null;

        const parsedUser: unknown = JSON.parse(storedUser);

        if (
            typeof parsedUser !== 'object' ||
            parsedUser === null ||
            !('id' in parsedUser) ||
            typeof parsedUser.id !== 'number' ||
            !('login' in parsedUser) ||
            typeof parsedUser.login !== 'string' ||
            !('avatar_url' in parsedUser) ||
            typeof parsedUser.avatar_url !== 'string' ||
            !('html_url' in parsedUser) ||
            typeof parsedUser.html_url !== 'string' ||
            !('type' in parsedUser) ||
            typeof parsedUser.type !== 'string'
        ) {
            return null;
        }

        return { user: parsedUser as GitHubUser, token: storedToken };
    } catch {
        return null;
    }
};
