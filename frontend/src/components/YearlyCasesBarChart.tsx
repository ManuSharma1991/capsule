import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Box, useTheme } from '@mui/material';
import type { YearlyCaseData } from '../types/dashboard';

interface YearlyCasesBarChartProps {
    data: YearlyCaseData[];
}

const YearlyCasesBarChart: React.FC<YearlyCasesBarChartProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%', height: 200 }}>
            <Typography variant="subtitle2" align="center" gutterBottom>
                Year-on-Year Pendency & Total Cases
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalCases" name="Total Cases" fill={theme.palette.primary.main} />
                    <Bar dataKey="pendingCases" name="Pending Cases" fill={theme.palette.secondary.main} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default YearlyCasesBarChart;
