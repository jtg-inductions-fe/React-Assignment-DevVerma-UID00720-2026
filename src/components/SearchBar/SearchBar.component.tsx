import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

import { StyledTextField } from './SearchBar.style';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchBar = ({
    value,
    onChange,
    placeholder = 'Search...',
}: SearchBarProps) => (
    <StyledTextField
        fullWidth
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        slotProps={{
            htmlInput: { 'aria-label': placeholder },
            input: {
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                ),
            },
        }}
    />
);
