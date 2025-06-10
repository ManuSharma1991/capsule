import { type FC } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import KeyboardArrowLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/ChevronRight';
import BarChartIcon from '@mui/icons-material/BarChart';
import GavelIcon from '@mui/icons-material/Gavel';
import { drawerWidth, DrawerHeader } from './DashboardStyles';
import { useLocation, useNavigate } from 'react-router-dom';

interface DashboardDrawerProps {
    drawerOpen: boolean;
    handleDrawerToggle: () => void;
}

const DashboardDrawer: FC<DashboardDrawerProps> = ({ drawerOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { text: 'Cases', path: '/cases', icon: <GavelIcon /> },
        { text: 'Reports', path: '/reports', icon: <BarChartIcon /> },
        { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    ];

    return (
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
            onClose={isMobile ? handleDrawerToggle : undefined}
        >
            <DrawerHeader>
                <Typography variant="h6" sx={{ mr: 'auto', ml: 1 }}>Menu</Typography>
                <IconButton onClick={handleDrawerToggle}>
                    {theme.direction === 'ltr' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                </IconButton>
            </DrawerHeader>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                        }}
                        disablePadding
                    >
                        <ListItemButton
                            sx={{
                                backgroundColor: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                                '&:hover': {
                                    backgroundColor: location.pathname === item.path ? theme.palette.primary.dark : theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: location.pathname === item.path ? theme.palette.common.white : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    color: location.pathname === item.path ? theme.palette.common.white : 'inherit',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => alert('Logout clicked!')}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
                <Typography
                    variant="caption"
                    sx={{
                        textAlign: 'center',
                        mt: 2,
                        mb: 1,
                        color: 'text.secondary',
                        display: 'block', // Ensures it takes full width for centering
                    }}
                >
                    {'ITAT Case Management System © '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </List>
        </Drawer>
    );
};

export default DashboardDrawer;
