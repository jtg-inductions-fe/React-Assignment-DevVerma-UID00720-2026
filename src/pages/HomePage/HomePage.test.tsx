import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';
import githubSearchReducer from '@store/githubSearch/githubSearchSlice';
import { act, fireEvent, render, screen } from '@testing-library/react';

import HomePage from './HomePage';
import {
    type GitHubSearchResponse,
    searchGitHubUsers as searchGitHubUsersApi,
} from '../../api/githubApi';

vi.mock('../../api/githubApi', () => ({
    searchGitHubUsers: vi.fn(),
}));

const mockedSearchGitHubUsersApi = vi.mocked(searchGitHubUsersApi);

const mockResults: GitHubSearchResponse = {
    total_count: 25,
    incomplete_results: false,
    items: [
        {
            id: 1,
            login: 'react-user',
            avatar_url: 'https://example.com/avatar.png',
            html_url: 'https://github.com/react-user',
            type: 'User',
        },
    ],
};

function renderHomePage() {
    const store = configureStore({
        reducer: {
            githubSearch: githubSearchReducer,
        },
    });

    render(
        <Provider store={store}>
            <HomePage />
        </Provider>,
    );

    return store;
}

describe('HomePage integration', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockedSearchGitHubUsersApi.mockReset();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders the page heading and search input', () => {
        renderHomePage();

        expect(
            screen.getByRole('heading', { name: 'Find GitHub Users' }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
        ).toBeInTheDocument();
    });

    it('waits for the debounce before searching and displays results', async () => {
        mockedSearchGitHubUsersApi.mockResolvedValue(mockResults);

        renderHomePage();

        fireEvent.change(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
            { target: { value: 'react' } },
        );

        expect(mockedSearchGitHubUsersApi).not.toHaveBeenCalled();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(400);
        });

        expect(mockedSearchGitHubUsersApi).toHaveBeenCalledTimes(1);
        expect(mockedSearchGitHubUsersApi).toHaveBeenCalledWith(
            'react',
            3,
            expect.any(AbortSignal),
        );

        expect(
            screen.getByText('Found 25 matching users.'),
        ).toBeInTheDocument();
    });

    it('shows an error notification when the search fails', async () => {
        mockedSearchGitHubUsersApi.mockRejectedValue(
            new Error('GitHub API request failed'),
        );

        renderHomePage();

        fireEvent.change(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
            { target: { value: 'react' } },
        );

        await act(async () => {
            await vi.advanceTimersByTimeAsync(400);
        });

        expect(
            screen.getByText('GitHub API request failed'),
        ).toBeInTheDocument();
    });

    it('does not search when the input contains only whitespace', async () => {
        renderHomePage();

        fireEvent.change(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
            { target: { value: '   ' } },
        );

        await act(async () => {
            await vi.advanceTimersByTimeAsync(400);
        });

        expect(mockedSearchGitHubUsersApi).not.toHaveBeenCalled();
    });
});
