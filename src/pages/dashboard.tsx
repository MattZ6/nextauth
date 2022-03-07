import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext'
import { setupApiClient } from '../services/api';
import { GetProfileService } from '../services/user';

import { withSSTAuth } from '../utils/withSSRAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    GetProfileService.getProfile();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      { user && <address>{user.email}</address> }
    </>
  )
}

export const getServerSideProps = withSSTAuth(async (ctx) => {
  const { api } = setupApiClient(ctx);

  await api.get('/me');

  return {
    props: { },
  }
});
