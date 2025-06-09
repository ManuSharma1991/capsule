import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CasesFilterCard from '../../components/CasesComponents/CasesFilterCard';
import CasesTable from '../../components/CasesComponents/CasesTable';
import type { Case } from '../../types/cases';
import { fetchCases } from '../../lib/mock/casesMock';
import type { FilterState } from '../../components/CasesComponents/CasesFilterCard'; // Import FilterState

// Helper function to extract serial number from caseNo
const extractSerialNumber = (caseNo: string): number => {
    const match = caseNo.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const CasesPage: React.FC = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [totalCases, setTotalCases] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState<keyof Case>('caseNo');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({ // Use FilterState type
        caseNo: '',
        filedBy: '',
        name: '',
        amount: '',
        section: '',
        assessmentYear: '',
        arguedBy: '',
        status: '',
    });
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // New state for selected year

    const applyFiltersAndSort = (data: Case[], currentFilters: FilterState, currentOrderBy: keyof Case, currentOrder: 'asc' | 'desc', currentYear: number) => {
        const filteredData = data.filter(caseItem => { // Changed to const
            // Apply text filters
            const matchesCaseNo = currentFilters.caseNo ? caseItem.caseNo.toLowerCase().includes(currentFilters.caseNo.toLowerCase()) : true;
            const matchesFiledBy = currentFilters.filedBy ? caseItem.filedBy.toLowerCase().includes(currentFilters.filedBy.toLowerCase()) : true;
            const matchesName = currentFilters.name ? (
                caseItem.appellantsName.toLowerCase().includes(currentFilters.name.toLowerCase()) ||
                caseItem.respondentsName.toLowerCase().includes(currentFilters.name.toLowerCase())
            ) : true;
            const matchesAmount = currentFilters.amount ? caseItem.disputedAmount.toString().includes(currentFilters.amount) : true;
            const matchesSection = currentFilters.section ? caseItem.assessedSection.toLowerCase().includes(currentFilters.section.toLowerCase()) : true;
            const matchesAssessmentYear = currentFilters.assessmentYear ? caseItem.assessmentYear.toString().includes(currentFilters.assessmentYear) : true;
            const matchesArguedBy = currentFilters.arguedBy ? caseItem.arguedBy.toLowerCase().includes(currentFilters.arguedBy.toLowerCase()) : true;
            const matchesStatus = currentFilters.status ? caseItem.caseStatus.toLowerCase().includes(currentFilters.status.toLowerCase()) : true;

            // Apply year filter based on caseNo's year
            const caseYearMatch = caseItem.caseNo.match(/\/(\d{4})$/);
            const caseYear = caseYearMatch ? parseInt(caseYearMatch[1], 10) : null;
            const matchesYear = currentYear ? (caseYear === currentYear) : true;

            return matchesCaseNo && matchesFiledBy && matchesName && matchesAmount && matchesSection && matchesAssessmentYear && matchesArguedBy && matchesStatus && matchesYear;
        });

        // Apply sorting
        const sortedData = [...filteredData].sort((a, b) => {
            if (currentOrderBy === 'caseNo') {
                const aSerial = extractSerialNumber(a.caseNo);
                const bSerial = extractSerialNumber(b.caseNo);
                return currentOrder === 'asc' ? aSerial - bSerial : bSerial - aSerial;
            } else {
                // Default sorting for other properties
                const aValue = a[currentOrderBy];
                const bValue = b[currentOrderBy];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return currentOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return currentOrder === 'asc' ? aValue - bValue : bValue - aValue;
                }
                // Fallback for other types or mixed types
                return 0;
            }
        });
        return sortedData;
    };

    useEffect(() => {
        const loadCases = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchCases(); // Using mock fetch for now
                const processedData = applyFiltersAndSort(data, filters, orderBy, order, selectedYear);
                setCases(processedData);
                setTotalCases(processedData.length); // For mock data, total is just length
            } catch (err: unknown) {
                console.error("Failed to load cases data:", err);
                setError("Failed to load cases data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadCases();
    }, [filters, orderBy, order, selectedYear]); // Re-run effect when filters, sort order, or year changes

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        // In a real app, you'd refetch data with new page
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page when rows per page changes
        // In a real app, you'd refetch data with new rowsPerPage
    };

    const handleSort = (property: keyof Case) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        // Data will be re-sorted by useEffect
    };

    const handleFilterChange = (newFilters: FilterState) => { // Use FilterState type
        setFilters(newFilters);
        setPage(0); // Reset page on filter change
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        setPage(0); // Reset page on year change
    };

    const handleSearchDatabase = () => {
        console.log("Searching database for more cases...");
        // Implement actual database search logic here
        // This might involve navigating to a different page, opening a modal,
        // or making a new API call to a different endpoint.
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <CasesFilterCard onFilterChange={handleFilterChange} onYearChange={handleYearChange} />
            <CasesTable
                cases={cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} // Apply pagination
                totalCases={totalCases}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSort={handleSort}
                orderBy={orderBy}
                order={order}
                isLoading={isLoading}
                error={error}
                onSearchDatabase={handleSearchDatabase} // Pass the new prop
            />
        </Box>
    );
};

export default CasesPage;
