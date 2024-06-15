import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useHrAccess = () => {
  const { user, loading } = useAuth();

  const axiosSecure = useAxiosSecure();

  const {
    data: accessPayment = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['accessPayment', user?.email],
    // enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/payment-check/${user?.email}`);
      return data;
    },
  });
  return [accessPayment, isLoading, refetch];
};

export default useHrAccess;
