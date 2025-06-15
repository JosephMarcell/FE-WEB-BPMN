import { RouterProperty } from '@/helpers/utils/user_management/router';

export interface PermissionProperty {
  pkid: string;
  role_id: string;
  router_id: string;
  can_read_all: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  Router: RouterProperty;
}

export interface CheckPermissionProperty {
  router: string;
  user_id: string;
}

export interface PermissionDataTable {
  pkid: string | null;
  router_id: string;
  role_id: string | null;
  name: string;
  can_read: boolean;
  can_read_all: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}
