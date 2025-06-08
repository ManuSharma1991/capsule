import { type FC } from 'react';
import {
    Paper,
    TextField,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface DashboardSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const DashboardSearchBar: FC<DashboardSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <Paper elevation={3} sx={{ mb: 3, mt: 2, p: 2 }}>
            <TextField
                fullWidth
                label="Search Cases (e.g., Case No, Assessee Name, Year)"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Paper>
    );
};

export default DashboardSearchBar;
