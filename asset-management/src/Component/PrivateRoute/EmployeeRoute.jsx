import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const EmployeeRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  const axiosSecure = useAxiosSecure();

  const {
    data: accessEmployee = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['accessEmployee ', user?.email],
    // enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/employee-check/${user?.email}`);
      return data;
    },
  });
  if (loading) {
    console.log(loading);
    return <span className="loading loading-ring loading-lg"></span>;
  }
  if (accessEmployee.length < 1) {
    console.log('employee access');
    return <Navigate to="/notice" state={location?.pathname || '/'}></Navigate>;
  }

  return <div>{children}</div>;
};

export default EmployeeRoute;
