import { describe, expect, it } from 'vitest';

import { type GitHubUser } from '@api/githubApi';
import { render, screen } from '@testing-library/react';

import UserInfo from './UserInfo';

const mockUser: GitHubUser = {
    id: 1,
    login: 'react-user',
    avatar_url: 'https://example.com/avatar.png',
    html_url: 'https://github.com/react-user',
    type: 'User',
};

describe('UserInfo', () => {
    it('renders the user avatar', () => {
        render(<UserInfo user={mockUser} />);

        expect(
            screen.getByRole('img', { name: 'react-user' }),
        ).toBeInTheDocument();
    });

    it('renders the username', () => {
        render(<UserInfo user={mockUser} />);

        expect(screen.getByText('react-user')).toBeInTheDocument();
    });

    it('renders the account type', () => {
        render(<UserInfo user={mockUser} />);

        expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('renders a link to the GitHub profile', () => {
        render(<UserInfo user={mockUser} />);

        const profileLink = screen.getByRole('link', {
            name: `View ${mockUser.login}'s GitHub profile`,
        });

        expect(profileLink).toHaveAttribute(
            'href',
            'https://github.com/react-user',
        );

        expect(profileLink).toHaveAttribute('target', '_blank');
        expect(profileLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
