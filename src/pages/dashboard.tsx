import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <h1>Dashboard</h1>
      { user && <address>{user.email}</address> }
    </>
  )
}
