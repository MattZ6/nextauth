import { useEffect } from 'react';

import { Can } from '../components/Can';

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

      <Can permissions={['metrics.list']} roles={['administrator']}>
        <div>Metrics</div>
      </Can>
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
