import { GITHUB_API_BASE_URL, GITHUB_API_PATHS } from './github.constant';
import type {
    GitHubApiRequestOptions,
    GitHubSearchResponse,
    GitHubUser,
} from './github.type';

async function requestGitHubApi<T>(
    endpoint: string,
    options: GitHubApiRequestOptions = {},
): Promise<T> {
    const { signal, token } = options;

    const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
        headers,
        signal,
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            data &&
            typeof data === 'object' &&
            'message' in data &&
            typeof data.message === 'string'
                ? data.message
                : 'Unable to fetch data from GitHub.';

        if (response.status === 401) {
            throw new Error('Invalid or expired GitHub personal access token.');
        }

        if (response.status === 403) {
            throw new Error(
                'GitHub API rate limit exceeded or access was denied. Please try again later.',
            );
        }

        if (response.status === 404) {
            throw new Error('The requested resource was not found on GitHub.');
        }

        throw new Error(message);
    }

    // no data
    if (response.status === 204) {
        return null as T;
    }

    if (data === null) {
        throw new Error('GitHub returned an empty response.');
    }

    return data as T;
}

export function searchGitHubUsers(
    query: string,
    perPage: number,
    signal?: AbortSignal,
): Promise<GitHubSearchResponse> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return Promise.reject(new Error('Search query cannot be empty.'));
    }

    const params = new URLSearchParams({
        q: trimmedQuery,
        per_page: perPage.toString(),
    });

    return requestGitHubApi<GitHubSearchResponse>(
        `${GITHUB_API_PATHS.SEARCH_USERS}?${params.toString()}`,
        { signal },
    );
}

export function getAuthenticatedGitHubUser(
    token: string,
    signal?: AbortSignal,
): Promise<GitHubUser> {
    return requestGitHubApi<GitHubUser>(GITHUB_API_PATHS.AUTHENTICATED_USER, {
        token,
        signal,
    });
}

export function getSuggestedGitHubUsers(
    token: string,
    perPage: number,
    since?: number,
    signal?: AbortSignal,
): Promise<GitHubUser[]> {
    const params = new URLSearchParams({
        per_page: perPage.toString(),
    });

    if (since !== undefined) {
        params.set('since', String(since));
    }

    return requestGitHubApi<GitHubUser[]>(
        `${GITHUB_API_PATHS.SUGGESTED_USERS}?${params.toString()}`,
        {
            token,
            signal,
        },
    );
}
