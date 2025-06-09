import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TableSortLabel,
    TablePagination,
    Button, // Import Button
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import type { Case } from '../../types/cases';

interface CasesTableProps {
    cases: Case[];
    totalCases: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSort: (property: keyof Case) => void;
    orderBy: keyof Case;
    order: 'asc' | 'desc';
    isLoading: boolean;
    error: string | null;
    onSearchDatabase: () => void; // New prop for searching database
}

const headCells: { id: keyof Case; label: string; align?: 'right' }[] = [
    { id: 'caseNo', label: 'Case No' },
    { id: 'filedBy', label: 'Filed By' },
    { id: 'appellantsName', label: 'Appellants Name' },
    { id: 'respondentsName', label: 'Respondents Name' },
    { id: 'assessmentYear', label: 'Assessment Year' },
    { id: 'assessedSection', label: 'Assessed Section' },
    { id: 'disputedAmount', label: 'Disputed Amount', align: 'right' },
    { id: 'caseStatus', label: 'Case Status' },
];

const CasesTable: React.FC<CasesTableProps> = ({
    cases,
    totalCases,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onSort,
    orderBy,
    order,
    isLoading,
    error,
    onSearchDatabase, // Destructure new prop
}) => {
    const createSortHandler = (property: keyof Case) => () => {
        onSort(property);
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1">Loading cases...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="body1">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="cases table">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.align || 'left'}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                        {orderBy === headCell.id ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        No cases found.
                                    </Typography>
                                    <Button variant="contained" onClick={onSearchDatabase}>
                                        Search Database
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            cases.map((row) => (
                                <TableRow
                                    hover
                                    key={row.caseNo}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.caseNo}
                                    </TableCell>
                                    <TableCell>{row.filedBy}</TableCell>
                                    <TableCell>{row.appellantsName}</TableCell>
                                    <TableCell>{row.respondentsName}</TableCell>
                                    <TableCell>{row.assessmentYear}</TableCell>
                                    <TableCell>{row.assessedSection}</TableCell>
                                    <TableCell align="right">{row.disputedAmount}</TableCell>
                                    <TableCell>{row.caseStatus}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCases}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
};

export default CasesTable;
