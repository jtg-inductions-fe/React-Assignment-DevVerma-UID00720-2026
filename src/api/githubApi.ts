export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;

    name?: string | null;
    location?: string | null;
    followers?: number;
    following?: number;
    bio?: string | null;
    blog?: string | null;
    email?: string | null;
    public_repos?: number;
}

export interface GitHubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubUser[];
}

async function requestGitHubApi<T>(
    endpoint: string,
    signal?: AbortSignal,
): Promise<T> {
    const response = await fetch(`https://api.github.com${endpoint}`, {
        headers: {
            Accept: 'application/vnd.github+json',
        },
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
        signal,
    );
}
