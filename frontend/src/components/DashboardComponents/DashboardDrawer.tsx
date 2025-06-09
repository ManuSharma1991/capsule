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
import { useNavigate } from 'react-router-dom';

interface DashboardDrawerProps {
    drawerOpen: boolean;
    handleDrawerToggle: () => void;
}

const DashboardDrawer: FC<DashboardDrawerProps> = ({ drawerOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

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
                {['Dashboard', 'Cases', 'Reports', 'Settings'].map((text, index) => (
                    <ListItem key={text}
                        onClick={() => {
                            handleDrawerToggle();
                            switch (text) {
                                case 'Dashboard':
                                    navigate('/dashboard');
                                    break;
                                case 'Cases':
                                    navigate('/cases');
                                    break;
                                case 'Reports':
                                    navigate('/reports');
                                    break;
                                case 'Settings':
                                    navigate('/settings');
                                    break;
                                default:
                                    break;
                            }
                        }}
                        disablePadding>
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
            <Box sx={{ flexGrow: 1 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => alert('Logout clicked!')}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default DashboardDrawer;
