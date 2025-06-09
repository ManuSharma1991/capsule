import { type FC } from 'react';
import { drawerWidth, FooterTypography } from './DashboardStyles';

const DashboardFooter: FC = () => {
    return (
        <FooterTypography variant="body2" sx={{ position: 'absolute', bottom: 0, width: `calc(95% - ${drawerWidth}px)`, textAlign: 'center' }}>
            {'ITAT Case Management System © '}
            {new Date().getFullYear()}
            {'.'}
        </FooterTypography>
    );
};

export default DashboardFooter;
