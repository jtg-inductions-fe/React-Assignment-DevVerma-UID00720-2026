import { describe, expect, it } from 'vitest';

import type { GitHubSearchResponse } from '@api';

import {
    clearSearchError,
    clearSearchResults,
    searchGitHubUsers,
} from './githubSearch.slice';
import githubSearchReducer from './githubSearch.slice';

const initialState: ReturnType<typeof githubSearchReducer> = {
    results: null,
    status: 'idle',
    error: null,
};

const mockResults: GitHubSearchResponse = {
    total_count: 1,
    incomplete_results: false,
    items: [
        {
            id: 1,
            login: 'test-user',
            avatar_url: 'https://example.com/avatar.png',
            html_url: 'https://github.com/test-user',
            type: 'User',
        },
    ],
};

describe('githubSearchReducer', () => {
    it('returns the initial state', () => {
        expect(githubSearchReducer(undefined, { type: 'unknown' })).toEqual(
            initialState,
        );
    });

    it('sets loading status when a search starts', () => {
        const action = searchGitHubUsers.pending('request-1', {
            query: 'react',
        });

        const state = githubSearchReducer(initialState, action);

        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
    });

    it('stores the results when a search succeeds', () => {
        const loadingState = githubSearchReducer(
            initialState,
            searchGitHubUsers.pending('request-1', { query: 'react' }),
        );

        const action = searchGitHubUsers.fulfilled(mockResults, 'request-1', {
            query: 'react',
        });

        const state = githubSearchReducer(loadingState, action);

        expect(state.status).toBe('succeeded');
        expect(state.results).toEqual(mockResults);
        expect(state.error).toBeNull();
    });

    it('stores an error when a search fails', () => {
        const loadingState = githubSearchReducer(
            initialState,
            searchGitHubUsers.pending('request-1', { query: 'react' }),
        );

        const action = searchGitHubUsers.rejected(
            null,
            'request-1',
            { query: 'react' },
            'GitHub API request failed',
        );

        const state = githubSearchReducer(loadingState, action);

        expect(state.status).toBe('failed');
        expect(state.error).toBe('GitHub API request failed');
    });

    it('clears search results and resets the status', () => {
        const stateWithResults = {
            ...initialState,
            results: mockResults,
            status: 'succeeded' as const,
            error: 'Previous error',
        };

        const state = githubSearchReducer(
            stateWithResults,
            clearSearchResults(),
        );

        expect(state.results).toBeNull();
        expect(state.status).toBe('idle');
        expect(state.error).toBeNull();
    });

    it('clears the search error without clearing results', () => {
        const stateWithError = {
            ...initialState,
            results: mockResults,
            status: 'succeeded' as const,
            error: 'Previous error',
        };

        const state = githubSearchReducer(stateWithError, clearSearchError());

        expect(state.error).toBeNull();
        expect(state.results).toEqual(mockResults);
        expect(state.status).toBe('succeeded');
    });
});
