import { type FC, useState, useEffect, useMemo } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    CircularProgress, // Import CircularProgress
    Alert, // Import Alert
    Box, // Import Box for layout
    RadioGroup,
    FormControlLabel,
    Radio,
    useTheme,
} from '@mui/material';
import ExpandableTableRow from './ExpandableTableRow';
import type { MainTableRowData } from '../../types/dashboard';

interface DashboardCasesTableProps {
    cases: MainTableRowData[];
    expandedRowId: string | null;
    handleRowToggleExpand: (rowId: string) => void;
    selectedDate: Date;
    isLoadingTable: boolean; // New prop
    errorTable: string | null; // New prop
}

const DashboardCasesTable: FC<DashboardCasesTableProps> = ({
    cases,
    expandedRowId,
    handleRowToggleExpand,
    selectedDate,
    isLoadingTable,
    errorTable,
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedBenchType, setSelectedBenchType] = useState<string>(""); // "ALL" is selected by default
    const theme = useTheme();
    useEffect(() => {
        setPage(0); // Reset page to 0 when cases data changes (e.g., new date selected)
    }, [cases, selectedBenchType]); // Add selectedBenchType to dependency array

    const handleBenchTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        newBenchType: string,
    ) => {
        setSelectedBenchType(newBenchType);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredAndPaginatedCases = useMemo(() => {
        const filteredCases = selectedBenchType // If selectedBenchType is an empty string, it will be falsy, showing all cases
            ? cases.filter(c => c.benchType === selectedBenchType)
            : cases;
        return filteredCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [cases, page, rowsPerPage, selectedBenchType]);

    // Helper to format date for display (e.g., "Mon, Sep 09")
    const formatDateForDisplay = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 2 }} elevation={3}>
            {isLoadingTable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>Loading Cases...</Typography>
                </Box>
            ) : errorTable ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <Alert severity="error">{errorTable}</Alert>
                </Box>
            ) : (
                <>
                    <TableContainer sx={{ maxHeight: 650, minHeight: 650, overflowY: 'auto' }}> {/* Fixed height and scroll, added minHeight */}
                        <Table stickyHeader aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Sno</TableCell> {/* New Sno column */}
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Case No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Filed by</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessee's name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessment Year</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessed Section</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAndPaginatedCases.length > 0 ? (
                                    filteredAndPaginatedCases.map((row, index) => (
                                        <ExpandableTableRow
                                            key={row.id}
                                            row={row}
                                            sno={page * rowsPerPage + index + 1} // Calculate Sno
                                            isExpanded={expandedRowId === row.id}
                                            onToggleExpand={() => handleRowToggleExpand(row.id)}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}> {/* Updated colSpan */}
                                            <Typography variant="subtitle1" color="text.secondary">
                                                No cases found for {formatDateForDisplay(selectedDate)}.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={selectedBenchType ? cases.filter(c => c.benchType === selectedBenchType).length : cases.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <RadioGroup
                            row
                            value={selectedBenchType}
                            onChange={handleBenchTypeChange}
                            aria-label="bench type"
                            sx={{
                                borderRadius: '50px', // Overall pill shape for the group
                                border: '1px solid', // Outer border for the pill
                                borderColor: 'divider',
                                '& .MuiFormControlLabel-root': {
                                    margin: 0, // Remove default margins
                                    // minWidth: '40px', // Ensure clickable area
                                    // minHeight: '28px', // Ensure clickable area
                                    display: 'flex',
                                    // borderRadius: '50px', // Individual label pill shape
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '4px 8px', // Adjust padding
                                    // borderRight: '1px solid', // Separator between labels
                                    // borderRightColor: 'divider',
                                    '&:not(:first-of-type)': {
                                        // borderLeft: '1px solid', // Separator between labels
                                        // borderLeftColor: 'divider',
                                        // borderRight: '1px solid', // Separator between labels
                                        // borderRightColor: 'divider',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '1rem',
                                    },
                                    '& .MuiTypography-root': {
                                        fontSize: '0.75rem', // Smaller font size
                                        color: 'text.primary', // Default text color
                                    },
                                    // Apply selected styles directly to FormControlLabel when checked
                                    '&.Mui-checked': {
                                        backgroundColor: theme.palette.primary.main, // Use primary color for selected
                                        color: 'black', // Ensure label text is black for contrast on light primary color
                                        '& .MuiTypography-root': {
                                            color: 'black', // Ensure text color is black when selected
                                        },
                                        '&:hover': {
                                            backgroundColor: 'primary.dark', // Darken on hover when selected
                                        },
                                    },
                                    // '&:hover': {
                                    //     backgroundColor: 'action.hover', // Hover effect for unselected
                                    // },
                                },
                            }}
                        >
                            <FormControlLabel value="" control={<Radio />} label="ALL" />
                            <FormControlLabel value="DB" control={<Radio />} label="DB" />
                            <FormControlLabel value="SMC" control={<Radio />} label="SMC" />
                            <FormControlLabel value="TMB" control={<Radio />} label="TMB" />
                            <FormControlLabel value="PHM" control={<Radio />} label="PHM" />
                        </RadioGroup>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default DashboardCasesTable;
