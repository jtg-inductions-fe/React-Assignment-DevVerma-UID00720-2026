import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    type GitHubSearchResponse,
    searchGitHubUsers as searchGitHubUsersApi,
} from '@api';
import { HomePage } from '@pages';
import { githubSearchReducer } from '@store';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@api', () => ({
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
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        </Provider>,
    );

    return store;
}

describe('HomePage integration', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        mockedSearchGitHubUsersApi.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the page heading and search input', () => {
        renderHomePage();

        expect(
            screen.getByRole('heading', { name: 'Find GitHub Users' }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
        ).toBeInTheDocument();
    });

    it('waits for the debounce before searching and displays results', async () => {
        mockedSearchGitHubUsersApi.mockResolvedValue(mockResults);

        renderHomePage();

        await user.type(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
            'react',
        );

        await waitFor(() => {
            expect(mockedSearchGitHubUsersApi).toHaveBeenCalledTimes(1);
            expect(mockedSearchGitHubUsersApi).toHaveBeenCalledWith(
                'react',
                3,
                expect.any(AbortSignal),
            );
        });

        expect(
            screen.getByText('Found 25 matching users.'),
        ).toBeInTheDocument();
    });

    it('shows an error notification when the search fails', async () => {
        mockedSearchGitHubUsersApi.mockRejectedValue(
            new Error('GitHub API request failed'),
        );

        renderHomePage();

        await user.type(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
            'react',
        );

        await waitFor(() => {
            expect(
                screen.getByText('GitHub API request failed'),
            ).toBeInTheDocument();
        });
    });

    it('does not search when the input contains only whitespace', async () => {
        renderHomePage();

        await user.type(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
            '   ',
        );

        // Wait past the debounce window to confirm no call was made
        await waitFor(() => {}, { timeout: 500 });

        expect(mockedSearchGitHubUsersApi).not.toHaveBeenCalled();
    });

    it('displays the returned GitHub users after a successful search', async () => {
        mockedSearchGitHubUsersApi.mockResolvedValue(mockResults);

        renderHomePage();

        await user.type(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
            'react',
        );

        await waitFor(() => {
            expect(screen.getByText('react-user')).toBeInTheDocument();
        });

        expect(
            screen.getByRole('link', {
                name: `View ${mockResults.items[0].login}'s GitHub profile`,
            }),
        ).toHaveAttribute('href', 'https://github.com/react-user');
    });

    it('displays the no users found message when the API returns an empty result', async () => {
        mockedSearchGitHubUsersApi.mockResolvedValue({
            total_count: 0,
            incomplete_results: false,
            items: [],
        });

        renderHomePage();

        await user.type(
            screen.getByRole('searchbox', { name: 'Search GitHub users' }),
            'nonexistent-user',
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    'No users found. Try searching with another username.',
                ),
            ).toBeInTheDocument();
        });
    });
});
