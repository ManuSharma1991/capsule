import { type FC } from 'react';
import { FooterTypography } from './DashboardStyles';

const DashboardFooter: FC = () => {
    return (
        <FooterTypography variant="body2" sx={{ mt: 2 }}>
            {'ITAT Case Management System © '}
            {new Date().getFullYear()}
            {'.'}
        </FooterTypography>
    );
};

export default DashboardFooter;
