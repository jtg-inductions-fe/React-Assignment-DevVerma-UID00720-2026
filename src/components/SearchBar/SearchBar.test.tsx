import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from '@components';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('SearchBar', () => {
    it('renders the search input with its placeholder', () => {
        render(<SearchBar value="" onChange={vi.fn()} />);

        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('calls onChange for each keystroke', async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(<SearchBar value="" onChange={handleChange} />);

        await user.type(
            screen.getByRole('searchbox', { name: 'Search...' }),
            'react',
        );

        expect(handleChange).toHaveBeenCalledTimes(5);
        expect(handleChange).toHaveBeenLastCalledWith('t');
    });

    it('displays the value passed through props', () => {
        const { rerender } = render(
            <SearchBar value="typescript" onChange={vi.fn()} />,
        );

        expect(
            screen.getByRole('searchbox', { name: 'Search...' }),
        ).toHaveValue('typescript');

        rerender(<SearchBar value="react" onChange={vi.fn()} />);

        expect(
            screen.getByRole('searchbox', { name: 'Search...' }),
        ).toHaveValue('react');
    });
});
