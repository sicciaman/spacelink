import { useRole } from './useRole';
import type { UserRole } from '../lib/types';

export function usePermissions() {
  const { data: role } = useRole();

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!role) return false;

    switch (requiredRole) {
      case 'customer':
        return ['customer', 'creator', 'admin'].includes(role);
      case 'creator':
        return ['creator', 'admin'].includes(role);
      case 'admin':
        return role === 'admin';
      default:
        return false;
    }
  };

  return {
    isCustomer: hasPermission('customer'),
    isCreator: hasPermission('creator'),
    isAdmin: hasPermission('admin'),
    hasPermission
  };
}