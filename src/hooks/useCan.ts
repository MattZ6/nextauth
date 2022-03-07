import { useAuth } from '../contexts/AuthContext';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions, roles }: UseCanParams) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  if (permissions?.length) {
    const hasAllPermissions = permissions
      .every(permission => user!.permissions.includes(permission));

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length) {
    const hasAllRoles = roles
      .some(permission => user!.roles.includes(permission));

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
