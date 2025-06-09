import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Collapse,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent as type

export interface FilterState { // Export FilterState
    caseNo: string;
    filedBy: string;
    name: string;
    amount: string;
    section: string;
    assessmentYear: string;
    arguedBy: string;
    status: string;
}

interface CasesFilterCardProps {
    onFilterChange: (filters: FilterState) => void; // Use FilterState type
    onYearChange: (year: number) => void;
}

const CasesFilterCard: React.FC<CasesFilterCardProps> = ({ onFilterChange, onYearChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [filters, setFilters] = useState<FilterState>({ // Use FilterState type
        caseNo: '',
        filedBy: '',
        name: '', // For both appellant and respondent
        amount: '',
        section: '',
        assessmentYear: '',
        arguedBy: '',
        status: '',
    });
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Revert handleChange to a more flexible type to accommodate both TextField and Select
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleYearChange = (event: SelectChangeEvent<string>) => { // Keep SelectChangeEvent for year
        const year = parseInt(event.target.value, 10);
        setCurrentYear(year);
        onYearChange(year); // Notify parent about year change
    };

    const handleSearch = () => {
        console.log('Applying filters:', filters, 'Year:', currentYear);
        onFilterChange(filters); // Notify parent about filter changes
    };

    const handleClear = () => {
        const clearedFilters = {
            caseNo: '',
            filedBy: '',
            name: '',
            amount: '',
            section: '',
            assessmentYear: '',
            arguedBy: '',
            status: '',
        };
        setFilters(clearedFilters);
        setCurrentYear(new Date().getFullYear()); // Reset year to current
        console.log('Clearing filters');
        onFilterChange(clearedFilters); // Notify parent about cleared filters
        onYearChange(new Date().getFullYear()); // Notify parent about cleared year
    };

    // Mock data for dropdowns
    const filedByOptions = ['User A', 'User B', 'User C', 'User D'];
    const sections = ['Section 143(1)', 'Section 263', 'Section 148', 'Section 254'];
    const assessmentYears = ['2023-24', '2022-23', '2021-22', '2020-21'];
    const arguedByOptions = ['Advocate A', 'Advocate B', 'Advocate C'];
    const statuses = ['Pending', 'Closed', 'In Progress', 'Dismissed'];

    // Generate years for dropdown (e.g., current year and past 5 years)
    const currentFullYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentFullYear - i);

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Filter Cases
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    {/* Basic Filters */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            label="Case No"
                            name="caseNo"
                            value={filters.caseNo}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filed By</InputLabel>
                            <Select
                                name="filedBy"
                                value={filters.filedBy}
                                label="Filed By"
                                onChange={handleChange}
                            >
                                {filedByOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            label="Appellant/Respondent Name"
                            name="name"
                            value={filters.name}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                        />
                    </Grid>

                    {/* Year Dropdown */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Year</InputLabel>
                            <Select
                                name="year"
                                value={currentYear.toString()}
                                label="Year"
                                onChange={handleYearChange}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Advanced Filters */}
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Amount"
                                    name="amount"
                                    value={filters.amount}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Section</InputLabel>
                                    <Select
                                        name="section"
                                        value={filters.section}
                                        label="Section"
                                        onChange={handleChange}
                                    >
                                        {sections.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Assessment Year</InputLabel>
                                    <Select
                                        name="assessmentYear"
                                        value={filters.assessmentYear}
                                        label="Assessment Year"
                                        onChange={handleChange}
                                    >
                                        {assessmentYears.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Argued By</InputLabel>
                                    <Select
                                        name="arguedBy"
                                        value={filters.arguedBy}
                                        label="Argued By"
                                        onChange={handleChange}
                                    >
                                        {arguedByOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={filters.status}
                                        label="Status"
                                        onChange={handleChange}
                                    >
                                        {statuses.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Collapse>

                    {/* Action Buttons */}
                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button variant="contained" onClick={handleSearch}>
                            Search
                        </Button>
                        <IconButton onClick={handleExpandClick}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CasesFilterCard;
