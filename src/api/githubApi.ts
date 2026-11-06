export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;

    name?: string | null;
    company?: string | null;
    location?: string | null;
    followers?: number;
    following?: number;
    bio?: string | null;
    blog?: string | null;
    email?: string | null;
    public_repos?: number;
    public_gists?: number;
    created_at?: string;
}

export interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubUser[];
}

interface GitHubApiRequestOptions {
    signal?: AbortSignal;
    token?: string;
}

async function requestGitHubApi<T>(
    endpoint: string,
    options: GitHubApiRequestOptions = {},
): Promise<T> {
    const { signal, token } = options;

    const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com${endpoint}`, {
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

        throw new Error(message);
    }

    if (data === null) {
        throw new Error('GitHub returned an empty response.');
    }

    return data as T;
}

export function searchGitHubUsers(
    query: string,
    perPage = 3,
    signal?: AbortSignal,
): Promise<GitHubSearchResponse> {
    const params = new URLSearchParams({
        q: query,
        per_page: String(Math.min(Math.max(perPage, 1), 100)),
    });

    return requestGitHubApi<GitHubSearchResponse>(
        `/search/users?${params.toString()}`,
        { signal },
    );
}

export function getAuthenticatedGitHubUser(
    token: string,
    signal?: AbortSignal,
): Promise<GitHubUser> {
    return requestGitHubApi<GitHubUser>('/user', {
        token,
        signal,
    });
}

export function getSuggestedGitHubUsers(
    since?: number,
    perPage = 30,
    signal?: AbortSignal,
): Promise<GitHubUser[]> {
    const params = new URLSearchParams({
        per_page: String(Math.min(Math.max(perPage, 1), 100)),
    });

    if (since !== undefined) {
        params.set('since', String(since));
    }

    return requestGitHubApi<GitHubUser[]>(`/users?${params.toString()}`, {
        signal,
    });
}
