import { withSSTAuth } from '../utils/withSSRAuth';

export default function MetricsPage() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSTAuth(async (ctx) => {
  return {
    props: { },
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
});
