import { Box, Button, Typography, type ButtonProps } from '@mui/material'; // Paper is not used in this minimal version
import { styled } from '@mui/material/styles';
import { Link as RouterLink, type LinkProps } from 'react-router-dom'; // Import for navigation

// Example Icons (install @mui/icons-material if you haven't)
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Icon for tribunal/institution
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const FullPageHeroSection = styled(Box)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    color: theme.palette.primary.contrastText,
    // padding: theme.spacing(10, 2), // Padding might be adjusted or handled by inner content
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Key change: Use viewport height
    width: '100vw',   // Key change: Use viewport width
    boxSizing: 'border-box', // Ensure padding doesn't add to overall size if you re-add it
    overflow: 'hidden', // Prevent scrollbars if content slightly overflows due to rounding
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4), // Increased margin for better spacing
    fontWeight: 700,
    letterSpacing: '0.5px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    fontSize: 'clamp(2.5rem, 6vw, 4rem)', // Responsive font size
    padding: theme.spacing(0, 2), // Add some horizontal padding for text on smaller screens
}));

type ActionButtonProps = ButtonProps & Partial<LinkProps>;

const ActionButton = styled(Button)<ActionButtonProps>(({ theme }) => ({
    margin: theme.spacing(1.5, 2), // Adjusted margins
    padding: theme.spacing(1.5, 4),
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', // Responsive font size for buttons
    minWidth: '150px', // Ensure buttons have a decent minimum width
    [theme.breakpoints.down('sm')]: { // Stack buttons on small screens
        width: '80%',
        maxWidth: '300px',
        margin: theme.spacing(1, 0),
    }
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row', // Default to row
    gap: theme.spacing(2), // Spacing between buttons
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { // Stack buttons vertically on small screens
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%', // Take full width to center content within it
    }
}));


const HomePage = () => {
    return (
        // The outer Box for HomePage component itself might not need specific styling
        // if FullPageHeroSection handles everything.
        // However, sometimes parent elements in your layout (like from MainLayout)
        // might interfere, so ensuring this Box also doesn't constrain height can be useful.
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
            <FullPageHeroSection>
                <AccountBalanceIcon sx={{ fontSize: 'clamp(3rem, 8vw, 5rem)', mb: 3, opacity: 0.8 }} />
                <HeroTitle variant="h1"> {/* Use h1 for semantic correctness for main page title */}
                    ITAT Case Management System
                </HeroTitle>
                <ButtonsContainer>
                    <ActionButton
                        variant="contained"
                        color="secondary"
                        component={RouterLink} // Add RouterLink for navigation
                        to="/login"           // Specify the route
                        startIcon={<LoginIcon />}
                        size="large"
                    >
                        Login
                    </ActionButton>
                    <ActionButton
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(255,255,255,0.7)',
                            color: 'white',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                        component={RouterLink} // Add RouterLink for navigation
                        to="/register"        // Specify the route
                        startIcon={<AppRegistrationIcon />}
                        size="large"
                    >
                        Register
                    </ActionButton>
                </ButtonsContainer>
            </FullPageHeroSection>
        </Box>
    );
};

export default HomePage;