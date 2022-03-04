import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext'

import { GetProfileService } from '../services/user';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    GetProfileService.getProfile()
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      { user && <address>{user.email}</address> }
    </>
  )
}
