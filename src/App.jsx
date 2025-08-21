import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { DepartmentProvider } from './contexts/DepartmentContext';
import { StatusCategoryProvider } from './contexts/StatusCategoryContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import Auth from "./pages/Auth";
import Dashboard from "./pages/dashboard";
import Employees from "./pages/Employees";
import Applicants from "./pages/Applicants";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

// Loading component
const LoadingScreen = ({ message = 'Loading...' }) => (
  <Box sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <Box sx={{
      textAlign: 'center',
      p: 4,
      borderRadius: 2,
      backgroundColor: 'white',
      boxShadow: 1
    }}>
      <CircularProgress sx={{ mb: 2 }} />
      <p>{message}</p>
    </Box>
  </Box>
);

// Main App component
function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  return (
    <ThemeProvider theme={createTheme({})}>
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <DepartmentProvider>
          <StatusCategoryProvider>
            <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={currentUser}>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={currentUser}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute user={currentUser}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicants"
              element={
                <ProtectedRoute user={currentUser}>
                  <Applicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute user={currentUser}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute user={currentUser}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Auth />} 
            />
            <Route 
              path="*" 
              element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} 
            />
            </Routes>
          </StatusCategoryProvider>
        </DepartmentProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
