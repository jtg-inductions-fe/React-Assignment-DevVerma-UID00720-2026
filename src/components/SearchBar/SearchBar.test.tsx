import { describe, expect, it, vi } from 'vitest';

import { SearchBar } from '@components';

import { fireEvent, render, screen } from '@testing-library/react';

describe('SearchBar', () => {
    it('renders the search input with its placeholder', () => {
        render(<SearchBar value="" onChange={vi.fn()} />);

        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('calls onChange when the user types', () => {
        const handleChange = vi.fn();

        render(<SearchBar value="" onChange={handleChange} />);

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search...' }), {
            target: { value: 'react' },
        });

        expect(handleChange).toHaveBeenCalledWith('react');
    });

    it('displays the value passed through props', () => {
        render(<SearchBar value="typescript" onChange={vi.fn()} />);

        expect(
            screen.getByRole('searchbox', { name: 'Search...' }),
        ).toHaveValue('typescript');
    });
});
