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

export interface GitHubApiRequestOptions {
    signal?: AbortSignal;
    token?: string;
}
