import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan';
import { setupApiClient } from '../services/api';
import { GetProfileService } from '../services/user';

import { withSSTAuth } from '../utils/withSSRAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
  });

  useEffect(() => {
    GetProfileService.getProfile();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      { user && <address>{user.email}</address> }

      { userCanSeeMetrics && (
        <div>Metrics</div>
      ) }
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
