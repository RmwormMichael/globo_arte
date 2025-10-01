import { useUser } from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;