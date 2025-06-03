import { useState, useEffect, type FC, Fragment } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    useTheme,
    useMediaQuery,
    Alert,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BarChartIcon from '@mui/icons-material/BarChart';
import GavelIcon from '@mui/icons-material/Gavel';


// Assuming you'll have a data service
// import { dataService } from '../../services/data.service';
import { fetchDashboardData, fetchDashboardDataWithError } from '../../lib/mock/dashboardMock'; // Using mock
import type { DashboardData, MainTableRowData, ReportCardData, CaseStatusData } from '../../types/dashboard';
import type { BackendErrorResponse } from '../../types/backendErrorResponse'; // Assuming this type exists
import { AxiosError } from 'axios'; // For error handling simulation

// --- Styled Components (can be in a separate file) ---

const FullPageBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column', // Ensures footer is at the bottom of the viewport if content is short
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    overflow: 'hidden', // Prevent body scroll, individual sections will scroll
}));

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 64px)', // Adjust 64px if AppBar height changes
    overflowY: 'auto', // Allows main content to scroll
}));

const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar, // necessary for content to be below app bar
    justifyContent: 'flex-end',
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Fill grid item height
    color: theme.palette.text.secondary,
}));

const FooterTypography = styled(Typography)(({ theme }) => ({
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    padding: theme.spacing(2, 0), // Add some padding to the footer
    marginTop: 'auto', // Pushes footer to bottom if content is short
}));

// --- Helper Components ---

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
                <TableCell>{row.applicantName}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.assignedTo}</TableCell>
                <TableCell>{row.lastActivity}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Case Details
                            </Typography>
                            <Table size="small" aria-label="case details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Attribute</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell>Last Updated</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.details.map((detailRow) => (
                                        <TableRow key={detailRow.id}>
                                            <TableCell component="th" scope="row">
                                                {detailRow.attribute}
                                            </TableCell>
                                            <TableCell>{detailRow.value}</TableCell>
                                            <TableCell>{detailRow.lastUpdated}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};


// --- Main Dashboard Page Component ---
const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile); // Open by default on desktop
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Replace with actual API call:
                // const data = await dataService.getDashboardData();
                const data = await fetchDashboardData(); // Using mock
                // const data = await fetchDashboardDataWithError(); // To test error state
                setDashboardData(data);
            } catch (err: unknown) {
                console.error("Failed to load dashboard data:", err);
                let displayMessage = "An unexpected error occurred.";
                if (err instanceof AxiosError && err.response && err.response.data && typeof err.response.data === 'object') {
                    const backendError = err.response.data as Partial<BackendErrorResponse>;
                    displayMessage = backendError.message || "Server error fetching data.";
                } else if (err instanceof Error) {
                    displayMessage = err.message;
                }
                setError(displayMessage);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => { // Adjust drawer based on screen size
        setDrawerOpen(!isMobile);
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleRowToggleExpand = (rowId: string) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    if (isLoading) {
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="inherit" size={60} />
                <Typography sx={{ color: 'white', mt: 2 }}>Loading Dashboard...</Typography>
            </FullPageBackground>
        );
    }

    if (error) {
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Paper sx={{ p: 3, maxWidth: 500, width: '100%' }}>
                    <Typography variant="h5" color="error" gutterBottom>Loading Error</Typography>
                    <Alert severity="error">{error}</Alert>
                    <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                        Try Again
                    </Button>
                </Paper>
            </FullPageBackground>
        );
    }

    if (!dashboardData) { // Should ideally not happen if isLoading and error are handled
        return (
            <FullPageBackground sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'white' }}>No data available.</Typography>
            </FullPageBackground>
        );
    }

    const { reportCard, caseStatusCard, cases } = dashboardData;

    return (
        <FullPageBackground>
            <Box sx={{ display: 'flex' }}>
                <StyledAppBar position="fixed" open={drawerOpen}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Dashboard
                        </Typography>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar">
                                        <AccountCircleIcon />
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">Profile</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </StyledAppBar>

                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant={isMobile ? "temporary" : "persistent"}
                    anchor="left"
                    open={drawerOpen}
                    onClose={isMobile ? handleDrawerToggle : undefined} // Close on backdrop click on mobile
                >
                    <DrawerHeader>
                        <Typography variant="h6" sx={{ mr: 'auto', ml: 1 }}>Menu</Typography>
                        <IconButton onClick={handleDrawerToggle}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <List>
                        {['Dashboard', 'Cases', 'Reports', 'Settings'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index === 0 && <DashboardIcon />}
                                        {index === 1 && <GavelIcon />}
                                        {index === 2 && <BarChartIcon />}
                                        {index === 3 && <SettingsIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ flexGrow: 1 }} /> {/* Pushes logout to bottom */}
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => alert('Logout clicked!')}> {/* Replace with actual logout */}
                                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>

                <Main open={drawerOpen}>
                    <DrawerHeader /> {/* To offset content by AppBar height */}

                    {/* Top Section: Cards (1/3 height approx) */}
                    <Grid container spacing={3} sx={{ mb: 3, flexShrink: 0 /* Prevents shrinking */ }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DashboardCard elevation={3}>
                                {reportCard.icon && <reportCard.icon sx={{ fontSize: 40, color: reportCard.color || 'primary.main', alignSelf: 'flex-end' }} />}
                                <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                                    {reportCard.title}
                                </Typography>
                                <Typography variant="h3" component="div" sx={{ color: reportCard.color || 'text.primary', mt: 1 }}>
                                    {reportCard.value}
                                </Typography>
                                <Typography variant="caption">
                                    Last updated: Just now
                                </Typography>
                            </DashboardCard>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DashboardCard elevation={3}>
                                {caseStatusCard.icon && <caseStatusCard.icon sx={{ fontSize: 40, color: caseStatusCard.color || 'secondary.main', alignSelf: 'flex-end' }} />}
                                <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                                    {caseStatusCard.title}
                                </Typography>
                                <Typography variant="h3" component="div" sx={{ color: caseStatusCard.color || 'text.primary', mt: 1 }}>
                                    {caseStatusCard.count}
                                </Typography>
                                <Typography variant="caption">
                                    Pending review: {caseStatusCard.count > 50 ? Math.floor(caseStatusCard.count / 3) : 5}
                                </Typography>
                            </DashboardCard>
                        </Grid>
                    </Grid>

                    {/* Bottom Section: Table (2/3 height approx) */}
                    <Paper sx={{ width: '100%', overflow: 'hidden', flexGrow: 1 /* Takes remaining space */, display: 'flex', flexDirection: 'column', mt: 4 }} elevation={3}>
                        <Typography variant="h6" sx={{ p: 2, color: 'text.primary' }}>
                            All Cases Overview
                        </Typography>
                        <TableContainer sx={{ flexGrow: 1 /* Allows table to scroll within Paper */ }}>
                            <Table stickyHeader aria-label="collapsible table">
                                <TableHead><TableRow><TableCell />
                                    <TableCell>Case Number</TableCell>
                                    <TableCell>Applicant Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell>Last Activity</TableCell></TableRow>
                                </TableHead><TableBody>
                                    {cases.map((row) => (
                                        <ExpandableTableRow
                                            key={row.id}
                                            row={row}
                                            isExpanded={expandedRowId === row.id}
                                            onToggleExpand={() => handleRowToggleExpand(row.id)}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <FooterTypography variant="body2" sx={{ mt: 2 }}>
                        {'ITAT Case Management System © '}
                        {new Date().getFullYear()}
                        {'.'}
                    </FooterTypography>
                </Main>
            </Box>
        </FullPageBackground>
    );
};

export default DashboardPage;