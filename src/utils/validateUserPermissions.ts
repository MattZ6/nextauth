type UserPermissions = {
  permissions: string[];
  roles: string[];
}

type Params = {
  user: UserPermissions;
  permissions?: string[];
  roles?: string[];
}

export function validateUserPermissions({ permissions, roles, user }: Params) {
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
