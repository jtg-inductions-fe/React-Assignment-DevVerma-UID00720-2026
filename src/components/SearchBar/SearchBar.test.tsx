import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import SearchBar from './SearchBar';

describe('SearchBar', () => {
    it('renders the search input with its placeholder', () => {
        render(<SearchBar value="" onChange={vi.fn()} />);

        expect(
            screen.getByPlaceholderText('Search GitHub users...'),
        ).toBeInTheDocument();
    });

    it('calls onChange when the user types', () => {
        const handleChange = vi.fn();

        render(<SearchBar value="" onChange={handleChange} />);

        fireEvent.change(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
            { target: { value: 'react' } },
        );

        expect(handleChange).toHaveBeenCalledWith('react');
    });

    it('displays the value passed through props', () => {
        render(<SearchBar value="typescript" onChange={vi.fn()} />);

        expect(
            screen.getByRole('textbox', {
                name: 'Search GitHub users',
            }),
        ).toHaveValue('typescript');
    });
});
