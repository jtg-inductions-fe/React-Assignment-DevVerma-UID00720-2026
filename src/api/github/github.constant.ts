export const GITHUB_API_BASE_URL =
    import.meta.env.VITE_GITHUB_API_BASE_URL ?? 'https://api.github.com';

export const GITHUB_API_PATHS = {
    SEARCH_USERS: '/search/users',
    AUTHENTICATED_USER: '/user',
    SUGGESTED_USERS: '/users',
} as const;
