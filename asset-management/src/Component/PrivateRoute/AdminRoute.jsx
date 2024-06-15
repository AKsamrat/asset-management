import { Navigate, useLocation } from 'react-router-dom';
import useRool from '../../hooks/useRool';
import useHrAccess from '../../hooks/useHrAccess';
import useAuth from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, isLoading] = useRool();
  const [accessPayment] = useHrAccess();
  const location = useLocation();

  console.log(accessPayment);
  if (loading || isLoading) {
    console.log(loading);
    return <span className="loading loading-ring loading-lg"></span>;
  }
  if (accessPayment.length < 1) {
    console.log('admin access');
    return (
      <Navigate to="/paymentPage" state={location?.pathname || '/'}></Navigate>
    );
  }

  return <div>{children}</div>;
};

export default AdminRoute;
