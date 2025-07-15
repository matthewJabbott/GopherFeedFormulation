import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { getUserRole } from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
    const token = await getToken();

      if (isLoaded && user) {
        try {
          const userRole = await getUserRole(token, user.id);
          setRole(userRole);
        } catch (err) {
          console.error('Failed to fetch user role:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRole();
  }, [isLoaded, user, getToken]);

  return React.createElement(
    UserContext.Provider,
    { value: { role, loading } },
    children
  );
};

export const useUserRole = () => useContext(UserContext);
