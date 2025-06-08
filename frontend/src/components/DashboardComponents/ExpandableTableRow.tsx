import { type FC, Fragment } from 'react';
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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { MainTableRowData } from '../../types/dashboard';

interface ExpandableTableRowProps {
    row: MainTableRowData;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const ExpandableTableRow: FC<ExpandableTableRowProps> = ({ row, isExpanded, onToggleExpand }) => {
    return (
        <Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell><IconButton aria-label="expand row" size="small" onClick={onToggleExpand}>
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton></TableCell>
                <TableCell component="th" scope="row">
                    {row.caseNumber}
                </TableCell>
                <TableCell>{row.filedBy}</TableCell>
                <TableCell>
                    {row.filedBy === 'ASSESSEE' ? row.applicantName : row.respondantName}
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
                                <Table size="small" aria-label="hearings table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Remarks</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.hearings.map((hearing) => (
                                            <TableRow key={hearing.id}>
                                                <TableCell>{hearing.date}</TableCell>
                                                <TableCell>{hearing.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                            <TableCell>{row.financials.disputedAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">Case Status</TableCell>
                                            <TableCell>{row.financials.caseStatus}</TableCell>
                                        </TableRow>
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
