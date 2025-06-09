import React, { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Import Outlet
import DashboardAppBar from './DashboardComponents/DashboardAppBar';
import DashboardDrawer from './DashboardComponents/DashboardDrawer';
import { FullPageBackground, Main, DrawerHeader } from './DashboardComponents/DashboardStyles';
import DashboardFooter from './DashboardComponents/DashboardFooter';

const MainLayout: React.FC = () => { // Remove children prop
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(!isMobile);

    useEffect(() => {
        setDrawerOpen(!isMobile);
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <FullPageBackground>
            <Box sx={{ display: 'flex' }}>
                <DashboardAppBar
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />

                <DashboardDrawer
                    drawerOpen={drawerOpen}
                    handleDrawerToggle={handleDrawerToggle}
                />

                <Main open={drawerOpen}>
                    <DrawerHeader />
                    <Outlet /> {/* Render nested routes here */}
                    <DashboardFooter />
                </Main>
            </Box>
        </FullPageBackground>
    );
};

export default MainLayout;
