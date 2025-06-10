import { type FC, useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { type CauselistCase, type Case } from '../../types/cases'; // Import Case type as well
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { dataService } from '../../services/data.service'; // Import dataService
import { AxiosError } from 'axios';

const GenerateCauselistPage: FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [casePart1, setCasePart1] = useState<string>('ITA');
    const [casePart2, setCasePart2] = useState<string>('');
    const [casePart3, setCasePart3] = useState<string>('NAG');
    const [casePart4, setCasePart4] = useState<string>(String(new Date().getFullYear()));
    const [isDateFixed, setIsDateFixed] = useState<boolean>(false);
    const [causelistCases, setCauselistCases] = useState<CauselistCase[]>([]);
    const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
    const [editedCase, setEditedCase] = useState<Partial<CauselistCase> | null>(null);

    useEffect(() => {
        if (selectedDate) {
            setIsDateFixed(true);
        } else {
            setIsDateFixed(false);
        }
    }, [selectedDate]);

    const handleAddCase = async () => { // Mark as async
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }
        const fullCaseNo = `${casePart1} ${casePart2}/${casePart3}/${casePart4}`;
        console.log('Adding case:', fullCaseNo, 'for date:', format(selectedDate, 'yyyy-MM-dd'));

        try {
            const response = await dataService.casesByCaseNo(fullCaseNo);
            const fetchedCase: Case = response.data;

            const newCauselistCase: CauselistCase = {
                ...fetchedCase,
                id: fetchedCase.caseNo, // Ensure id is caseNo for consistency
                causelistSNo: causelistCases.length + 1, // Assign sequential SNo
                hearingDate: format(selectedDate, 'yyyy-MM-dd'),
                remarks: fetchedCase.notes || '', // Use existing notes as remarks, or empty string
            };

            setCauselistCases((prevCases) => {
                const updatedCases = [...prevCases, newCauselistCase];
                // Sort by benchType for display
                return updatedCases.sort((a, b) => a.benchType.localeCompare(b.benchType));
            });

        } catch (error) {
            if (error instanceof AxiosError) {
                console.error('Error fetching or creating case:', error.response?.data || error.message);
                alert(`Error: ${error.response?.data?.message || 'Failed to fetch or create case.'}`);
            } else {
                console.error('An unexpected error occurred:', error);
                alert('An unexpected error occurred.');
            }
        }

        // Reset case input fields
        setCasePart2('');
        setCasePart1('ITA');
        setCasePart3('NAG');
        setCasePart4(String(new Date().getFullYear()));
    };

    const handleSave = () => {
        console.log('Saving causelist:', causelistCases);
        // TODO: Implement save logic (upsert cases, add hearings)
        setIsDateFixed(false); // Allow date change after save
        setSelectedDate(null);
        setCauselistCases([]); // Clear table after save
        setCasePart1('ITA');
        setCasePart2('');
        setCasePart3('NAG');
        setCasePart4(String(new Date().getFullYear()));
    };

    const handleExport = () => {
        console.log('Exporting causelist:', causelistCases);
        // TODO: Implement export logic
        setIsDateFixed(false); // Allow date change after export
        setSelectedDate(null);
        setCauselistCases([]); // Clear table after export
        setCasePart1('ITA');
        setCasePart2('');
        setCasePart3('NAG');
        setCasePart4(String(new Date().getFullYear()));
    };

    const handleMoveCase = useCallback((index: number, direction: 'up' | 'down') => {
        setCauselistCases((prevCases) => {
            const newCases = [...prevCases];
            const [movedCase] = newCases.splice(index, 1);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (targetIndex >= 0 && targetIndex < newCases.length + 1) {
                newCases.splice(targetIndex, 0, movedCase);
                // Re-assign causelistSNo after reordering
                return newCases.map((c, i) => ({ ...c, causelistSNo: i + 1 }));
            }
            return prevCases; // No change if invalid move
        });
    }, []);

    const handleEditCase = (caseId: string) => {
        const caseToEdit = causelistCases.find(c => c.id === caseId);
        if (caseToEdit) {
            setEditingCaseId(caseId);
            setEditedCase({ ...caseToEdit });
        }
    };

    const handleSaveEditedCase = () => {
        if (editedCase && editingCaseId) {
            setCauselistCases(prevCases =>
                prevCases.map(c => (c.id === editingCaseId ? { ...c, ...editedCase } as CauselistCase : c))
            );
            setEditingCaseId(null);
            setEditedCase(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingCaseId(null);
        setEditedCase(null);
    };

    const handleDeleteCase = (caseId: string) => {
        setCauselistCases(prevCases => prevCases.filter(c => c.id !== caseId).map((c, i) => ({ ...c, causelistSNo: i + 1 })));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setEditedCase(prev => ({ ...prev, [name as string]: value }));
    };

    type GroupedCauselistCases = {
        [key: string]: CauselistCase[];
    };

    const groupedCases: GroupedCauselistCases = causelistCases.reduce((acc: GroupedCauselistCases, caseItem) => {
        const bench = caseItem.benchType || 'Uncategorized';
        if (!acc[bench]) {
            acc[bench] = [];
        }
        acc[bench].push(caseItem);
        return acc;
    }, {});

    const tableHeaders = [
        'S No', 'Hearing Date', 'Case No', 'Filed By', "Assessee's Name",
        'Assessment Year', 'Assessed Section', 'Disputed Amount', 'Argued By', 'Remarks', 'Actions'
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Generate Causelist
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 3, backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Hearing Date"
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                            }}
                            disabled={isDateFixed}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid size={{ xs: 12 / 5 }}>
                            <FormControl fullWidth disabled={!isDateFixed}>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={casePart1}
                                    label="Type"
                                    onChange={(e) => setCasePart1(e.target.value as string)}
                                >
                                    <MenuItem value="ITA">ITA</MenuItem>
                                    <MenuItem value="MA">MA</MenuItem>
                                    <MenuItem value="SA">SA</MenuItem>
                                    <MenuItem value="CO">CO</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 / 5 }}>
                            <TextField
                                label="Number"
                                fullWidth
                                value={casePart2}
                                onChange={(e) => setCasePart2(e.target.value)}
                                disabled={!isDateFixed}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 / 5 }}>
                            <FormControl fullWidth disabled={!isDateFixed}>
                                <InputLabel>Bench</InputLabel>
                                <Select
                                    value={casePart3}
                                    label="Bench"
                                    onChange={(e) => setCasePart3(e.target.value as string)}
                                >
                                    <MenuItem value="NAG">NAG</MenuItem>
                                    {/* Add other bench options if needed */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 / 5 }}>
                            <TextField
                                label="Year"
                                fullWidth
                                value={casePart4}
                                onChange={(e) => setCasePart4(e.target.value)}
                                disabled={!isDateFixed}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 / 5 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                onClick={handleAddCase}
                                disabled={!isDateFixed || !casePart2 || !casePart4}
                                sx={{ mt: 1 }}
                            >
                                Add Case
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Causelist Details
                </Typography>
                {causelistCases.length === 0 ? (
                    <Box sx={{ border: '1px dashed grey', p: 2, minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Case details will appear here after adding.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="causelist table">
                            <TableHead>
                                <TableRow>
                                    {tableHeaders.map((header) => (
                                        <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(groupedCases).map((benchType) => (
                                    <>
                                        <TableRow key={benchType}>
                                            <TableCell colSpan={tableHeaders.length} sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                                {benchType}
                                            </TableCell>
                                        </TableRow>
                                        {groupedCases[benchType].map((caseItem) => (
                                            <TableRow key={caseItem.id}>
                                                {editingCaseId === caseItem.id ? (
                                                    <>
                                                        <TableCell>{caseItem.causelistSNo}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="hearingDate"
                                                                value={editedCase?.hearingDate || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="caseNo"
                                                                value={editedCase?.caseNo || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="filedBy"
                                                                value={editedCase?.filedBy || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="appellantName"
                                                                value={editedCase?.filedBy === 'A' ? editedCase.appellantName : editedCase?.respondantName || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="assessmentYear"
                                                                value={editedCase?.assessmentYear || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="assessedSection"
                                                                value={editedCase?.assessedSection || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="disputedAmount"
                                                                value={editedCase?.disputedAmount || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="arguedBy"
                                                                value={editedCase?.arguedBy || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                name="remarks"
                                                                value={editedCase?.remarks || ''}
                                                                onChange={handleEditChange}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button onClick={handleSaveEditedCase} size="small">Save</Button>
                                                            <Button onClick={handleCancelEdit} size="small">Cancel</Button>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>{caseItem.causelistSNo}</TableCell>
                                                        <TableCell>{caseItem.hearingDate}</TableCell>
                                                        <TableCell>{caseItem.caseNo}</TableCell>
                                                        <TableCell>{caseItem.filedBy}</TableCell>
                                                        <TableCell width={200}>{caseItem?.filedBy === 'ASSESSEE' ? caseItem.appellantName : caseItem?.respondantName}</TableCell>
                                                        <TableCell>{caseItem.assessmentYear}</TableCell>
                                                        <TableCell>{caseItem.assessedSection}</TableCell>
                                                        <TableCell>{caseItem.disputedAmount}</TableCell>
                                                        <TableCell>{caseItem.arguedBy}</TableCell>
                                                        <TableCell>{caseItem.remarks}</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => handleEditCase(caseItem.id)} size="small">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleDeleteCase(caseItem.id)} size="small">
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleMoveCase(causelistCases.indexOf(caseItem), 'up')}
                                                                disabled={causelistCases.indexOf(caseItem) === 0}
                                                                size="small"
                                                            >
                                                                <ArrowUpwardIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleMoveCase(causelistCases.indexOf(caseItem), 'down')}
                                                                disabled={causelistCases.indexOf(caseItem) === causelistCases.length - 1}
                                                                size="small"
                                                            >
                                                                <ArrowDownwardIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={!isDateFixed || causelistCases.length === 0}>
                    Save Causelist
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleExport} disabled={!isDateFixed || causelistCases.length === 0}>
                    Export Causelist
                </Button>
            </Box>
        </Box>
    );
};

export default GenerateCauselistPage;
