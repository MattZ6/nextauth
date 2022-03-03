import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext'

import { api } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me')
      .then(response => {
        console.log(response);
      });
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      { user && <address>{user.email}</address> }
    </>
  )
}
