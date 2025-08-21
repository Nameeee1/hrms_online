import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, user }) => {
  const { currentUser, loading } = useAuth();
  
  // Use the user prop if provided, otherwise use the one from context
  const authUser = user || currentUser;
  
  if (loading) {
    // Optionally show a loading spinner here
    return null;
  }
  
  if (!authUser) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
