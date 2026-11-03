import { describe, expect, it } from 'vitest';

import {
    clearSearchError,
    clearSearchResults,
    searchGitHubUsers,
} from './githubSearchSlice';
import githubSearchReducer from './githubSearchSlice';
import type { GitHubSearchResponse } from '../../api/githubApi';

const initialState: ReturnType<typeof githubSearchReducer> = {
    results: null,
    status: 'idle',
    error: null,
    currentRequestId: undefined,
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
        const action = searchGitHubUsers.pending('request-1', 'react');

        const state = githubSearchReducer(initialState, action);

        expect(state.status).toBe('loading');
        expect(state.error).toBeNull();
        expect(state.currentRequestId).toBe('request-1');
    });

    it('stores the results when a search succeeds', () => {
        const loadingState = githubSearchReducer(
            initialState,
            searchGitHubUsers.pending('request-1', 'react'),
        );

        const action = searchGitHubUsers.fulfilled(
            mockResults,
            'request-1',
            'react',
        );

        const state = githubSearchReducer(loadingState, action);

        expect(state.status).toBe('succeeded');
        expect(state.results).toEqual(mockResults);
        expect(state.error).toBeNull();
        expect(state.currentRequestId).toBeUndefined();
    });

    it('stores an error when a search fails', () => {
        const loadingState = githubSearchReducer(
            initialState,
            searchGitHubUsers.pending('request-1', 'react'),
        );

        const action = searchGitHubUsers.rejected(
            null,
            'request-1',
            'react',
            'GitHub API request failed',
        );

        const state = githubSearchReducer(loadingState, action);

        expect(state.status).toBe('failed');
        expect(state.error).toBe('GitHub API request failed');
        expect(state.currentRequestId).toBeUndefined();
    });

    it('clears search results and resets the status', () => {
        const stateWithResults = {
            ...initialState,
            results: mockResults,
            status: 'succeeded' as const,
            error: 'Previous error',
            currentRequestId: 'request-1',
        };

        const state = githubSearchReducer(
            stateWithResults,
            clearSearchResults(),
        );

        expect(state.results).toBeNull();
        expect(state.status).toBe('idle');
        expect(state.error).toBeNull();
        expect(state.currentRequestId).toBeUndefined();
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
