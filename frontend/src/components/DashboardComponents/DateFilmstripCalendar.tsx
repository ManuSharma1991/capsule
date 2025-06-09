import { type FC, useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface DateFilmstripCalendarProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

const DateFilmstripCalendar: FC<DateFilmstripCalendarProps> = ({ selectedDate, setSelectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    useEffect(() => {
        // Ensure currentMonth stays in sync with selectedDate's month if selectedDate changes externally
        if (currentMonth.getMonth() !== selectedDate.getMonth() || currentMonth.getFullYear() !== selectedDate.getFullYear()) {
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        }
    }, [selectedDate]);

    const getDaysInMonth = (year: number, month: number) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(prevMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(prevMonth.getMonth() + 1);
            return newMonth;
        });
    };

    const daysInCurrentMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const today = new Date();

    return (
        <Box
            sx={{
                width: '100%', // Span entire space
                display: 'flex',
                alignItems: 'center',
                py: 1,
                px: 1,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                mb: 2, // Margin bottom for spacing
            }}
        >
            <IconButton onClick={handlePrevMonth} size="small">
                <ArrowBackIosIcon fontSize="small" />
            </IconButton>

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center', // Ensure vertical centering of items within this box
                    overflowX: 'auto', // Enable horizontal scrolling for the dates
                    scrollBehavior: 'smooth',
                    justifyContent: 'right', // Center the dates
                    '&::-webkit-scrollbar': {
                        height: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        borderRadius: '10px',
                    },
                }}
            >
                <Box sx={{ mr: 2, flexShrink: 0, minWidth: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        {currentMonth.toLocaleDateString('en-US', { year: 'numeric' })}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary', textTransform: 'uppercase' }}>
                        {currentMonth.toLocaleDateString('en-US', { month: 'short' })}
                    </Typography>
                </Box>
                {daysInCurrentMonth.map((date) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                        <Box
                            key={date.toISOString()}
                            sx={{
                                flexShrink: 0, // Prevent items from shrinking
                                textAlign: 'center',
                                p: 1,
                                mx: 0.5,
                                borderRadius: 1,
                                cursor: 'pointer',
                                bgcolor: isSelected ? 'primary.main' : (isToday ? 'action.selected' : 'transparent'),
                                color: isSelected ? 'primary.contrastText' : (isToday ? 'primary.main' : 'text.primary'),
                                border: isToday && !isSelected ? '1px solid' : 'none',
                                borderColor: 'primary.main',
                                transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
                                '&:hover': {
                                    bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                                },
                            }}
                            onClick={() => setSelectedDate(date)}
                        >
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </Typography>
                            <Typography variant="h6" sx={{ lineHeight: 1 }}>
                                {date.getDate()}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            <IconButton onClick={handleNextMonth} size="small">
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default DateFilmstripCalendar;
