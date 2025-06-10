import { type FC, useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExpandableTableRow from './ExpandableTableRow';
import type { MainTableRowData } from '../../types/dashboard';

interface DashboardCasesTableProps {
    cases: MainTableRowData[];
    expandedRowId: string | null;
    handleRowToggleExpand: (rowId: string) => void;
    selectedDate: Date;
}

const DashboardCasesTable: FC<DashboardCasesTableProps> = ({
    cases,
    expandedRowId,
    handleRowToggleExpand,
    selectedDate,
}) => {
    const [displayedCases, setDisplayedCases] = useState<MainTableRowData[]>([]);

    useEffect(() => {
        setDisplayedCases(cases);
    }, [cases]);

    // Helper to format date for display (e.g., "Mon, Sep 09")
    const formatDateForDisplay = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 2 }} elevation={3}>
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
                        {displayedCases.length > 0 ? (
                            displayedCases.map((row) => (
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
                                        No cases found for {formatDateForDisplay(selectedDate)}.
                                    </Typography>
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
