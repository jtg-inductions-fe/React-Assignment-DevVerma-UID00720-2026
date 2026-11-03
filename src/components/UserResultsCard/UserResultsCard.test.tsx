import { describe, expect, it } from 'vitest';

import { type GitHubUser } from '@api/githubApi';
import { render, screen } from '@testing-library/react';

import UserResultsCard from './UserResultsCard';

const mockUsers: GitHubUser[] = [
    {
        id: 1,
        login: 'react-user',
        avatar_url: 'https://example.com/react.png',
        html_url: 'https://github.com/react-user',
        type: 'User',
    },
    {
        id: 2,
        login: 'typescript-user',
        avatar_url: 'https://example.com/typescript.png',
        html_url: 'https://github.com/typescript-user',
        type: 'User',
    },
    {
        id: 3,
        login: 'node-user',
        avatar_url: 'https://example.com/node.png',
        html_url: 'https://github.com/node-user',
        type: 'Organization',
    },
];

describe('UserResultsCard', () => {
    it('displays the initial message when no search has been performed', () => {
        render(<UserResultsCard users={[]} hasSearched={false} />);

        expect(
            screen.getByText(
                'Search for GitHub users by their username to see results.',
            ),
        ).toBeInTheDocument();
    });

    it('displays a message when no users are found', () => {
        render(<UserResultsCard users={[]} hasSearched={true} />);

        expect(
            screen.getByText(
                'No users found. Try searching with another username.',
            ),
        ).toBeInTheDocument();
    });

    it('renders all the users passed through props', () => {
        render(<UserResultsCard users={mockUsers} hasSearched={true} />);

        expect(screen.getByText('react-user')).toBeInTheDocument();
        expect(screen.getByText('typescript-user')).toBeInTheDocument();
        expect(screen.getByText('node-user')).toBeInTheDocument();
    });

    it('renders a GitHub profile link for each user', () => {
        render(<UserResultsCard users={mockUsers} hasSearched={true} />);

        const profileLinks = screen.getAllByRole('link', {
            name: 'View Profile',
        });

        expect(profileLinks).toHaveLength(3);

        expect(profileLinks[0]).toHaveAttribute(
            'href',
            'https://github.com/react-user',
        );

        expect(profileLinks[1]).toHaveAttribute(
            'href',
            'https://github.com/typescript-user',
        );

        expect(profileLinks[2]).toHaveAttribute(
            'href',
            'https://github.com/node-user',
        );
    });

    it('renders the correct avatar for each user', () => {
        render(<UserResultsCard users={mockUsers} hasSearched={true} />);

        expect(screen.getByRole('img', { name: 'react-user' })).toHaveAttribute(
            'src',
            'https://example.com/react.png',
        );

        expect(
            screen.getByRole('img', { name: 'typescript-user' }),
        ).toHaveAttribute('src', 'https://example.com/typescript.png');

        expect(screen.getByRole('img', { name: 'node-user' })).toHaveAttribute(
            'src',
            'https://example.com/node.png',
        );
    });
});
