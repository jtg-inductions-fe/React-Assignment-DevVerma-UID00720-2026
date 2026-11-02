import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
        <TextField
            fullWidth
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search GitHub users..."
            aria-label="Search GitHub users"
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                },
            }}
            sx={{
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                },
            }}
        />
    );

export default SearchBar;
