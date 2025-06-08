import { type FC } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
} from '@mui/material';
import ExpandableTableRow from './ExpandableTableRow';
import type { MainTableRowData } from '../../types/dashboard';

interface DashboardCasesTableProps {
    filteredCases: MainTableRowData[];
    expandedRowId: string | null;
    handleRowToggleExpand: (rowId: string) => void;
    handleSearchDatabase: () => void;
    searchQuery: string;
}

const DashboardCasesTable: FC<DashboardCasesTableProps> = ({
    filteredCases,
    expandedRowId,
    handleRowToggleExpand,
    handleSearchDatabase,
    searchQuery,
}) => {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 4 }} elevation={3}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Case No</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Filed by</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessee's name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessment Year</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Assessed Section</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCases.length > 0 ? (
                            filteredCases.map((row) => (
                                <ExpandableTableRow
                                    key={row.id}
                                    row={row}
                                    isExpanded={expandedRowId === row.id}
                                    onToggleExpand={() => handleRowToggleExpand(row.id)}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        No matching cases found in current view.
                                    </Typography>
                                    <Button variant="contained" onClick={handleSearchDatabase} sx={{ mt: 2 }}>
                                        Search Database for "{searchQuery}"
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DashboardCasesTable;
