import { type FC, Fragment, useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    CircularProgress, // Added for loading indicator
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { MainTableRowData } from '../../types/dashboard';
import { dataService } from '../../services/data.service'; // Import dataService
import type { Case } from '../../types/cases'; // Import Case type
import type { AxiosResponse, AxiosError } from 'axios'; // Import AxiosResponse and AxiosError

interface ExpandableTableRowProps {
    row: MainTableRowData;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const formatIndianCurrency = (amount: string | number): string => {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }
    if (isNaN(amount)) {
        return 'N/A';
    }
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
};

const ExpandableTableRow: FC<ExpandableTableRowProps> = ({ row, isExpanded, onToggleExpand }) => {
    const [caseDetails, setCaseDetails] = useState<Case | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isExpanded && !caseDetails && !loading) {
            setLoading(true);
            setError(null);
            dataService.casesByCaseNo(row.caseNo) // Changed from row.caseNumber
                .then((response: AxiosResponse<Case>) => {
                    setCaseDetails(response.data);
                })
                .catch((err: AxiosError) => {
                    console.error('Error fetching case details:', err);
                    setError(err.message || 'Failed to load case details.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isExpanded, caseDetails, loading, row.caseNo]); // Changed from row.caseNumber

    return (
        <Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell><IconButton aria-label="expand row" size="small" onClick={onToggleExpand}>
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton></TableCell>
                <TableCell component="th" scope="row">
                    {row.caseNo}
                </TableCell>
                <TableCell>{row.filedBy}</TableCell>
                <TableCell>
                    {row.filedBy === 'ASSESSEE' ? row.appellantName : row.respondantName}
                </TableCell>
                <TableCell>{row.assessmentYear}</TableCell>
                <TableCell>{row.assessedSection}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, display: 'flex', gap: 2 }}>
                            {/* Left Side: Hearing Dates and Remarks */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Hearing Dates & Remarks
                                </Typography>
                                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={20} /></Box>}
                                {error && <Typography color="error">{error}</Typography>}
                                {caseDetails && caseDetails.hearings && caseDetails.hearings.length > 0 ? (
                                    <Table size="small" aria-label="hearings table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Remarks</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {caseDetails.hearings.map((hearing) => (
                                                <TableRow key={hearing.hearingDate}>
                                                    <TableCell>{hearing.hearingDate}</TableCell>
                                                    <TableCell>{hearing.remarks}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    !loading && !error && <Typography>No hearing data available.</Typography>
                                )}
                            </Box>

                            {/* Right Side: Disputed Amount, Case Status etc. */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Financial & Status Details
                                </Typography>
                                <Table size="small" aria-label="financial details table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">Disputed Amount</TableCell>
                                            <TableCell>{formatIndianCurrency(row.disputedAmount)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">Case Status</TableCell>
                                            <TableCell>{row.caseStatus}</TableCell>
                                        </TableRow>
                                        {caseDetails && (
                                            <TableRow>
                                                <TableCell component="th" scope="row">Argued By</TableCell>
                                                <TableCell>{caseDetails.arguedBy}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export default ExpandableTableRow;
