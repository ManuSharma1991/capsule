import { useState, useEffect } from 'react';
import './App.css'; // You can create this file for basic styling
import { Box, Typography, CircularProgress, Alert, AlertTitle } from '@mui/material'; // Assuming you use MUI

// Define an interface for the expected health check response
interface HealthStatus {
  status: string;
  message: string;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        // The proxy in vite.config.ts handles routing this to your backend
        const response = await fetch('/api/health');

        if (!response.ok) {
          // Try to get error message from backend if available
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Failed to parse error response:", e);
            // Backend didn't send JSON or it was unparseable
          }
          throw new Error(errorMessage);
        }

        const data: HealthStatus = await response.json();
        setHealthStatus(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error("Failed to fetch health status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Capsule Frontend
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom>
        Backend Health Check:
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Loading status...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, minWidth: '300px' }}>
          <AlertTitle>Error</AlertTitle>
          Failed to connect to backend: <br />
          <strong>{error}</strong>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Ensure the backend server is running and accessible on port 10000.
            Also check the browser console for more details.
          </Typography>
        </Alert>
      )}

      {!loading && healthStatus && !error && (
        <Alert
          severity={healthStatus.status === 'UP' ? 'success' : 'warning'}
          sx={{ mt: 2, minWidth: '300px' }}
        >
          <AlertTitle>
            Status: {healthStatus.status}
          </AlertTitle>
          {healthStatus.message}
        </Alert>
      )}

      <Typography variant="body2" sx={{ mt: 4 }}>
        More features coming soon!
      </Typography>
    </Box>
  );
}

export default App;