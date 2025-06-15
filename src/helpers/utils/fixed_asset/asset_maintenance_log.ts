export interface AssetMaintenanceLogProperty {
  pkid: string | null;
  model_pkid: string | null;
  model_name: string | null;
  model_type: string | null;
  user_pkid: string | null;
  user_name: string | null;
  maintenance_start: string | null;
  maintenance_end: string | null;
  maintenance_type: string | null;
  status: string | null;
  description: string | null;
  office_pkid: string | null;
  office_name: string | null;
}

export const assetMaintenanceLognitialState: AssetMaintenanceLogProperty = {
  pkid: null,
  model_pkid: null,
  model_name: null,
  model_type: null,
  user_pkid: null,
  user_name: null,
  maintenance_start: null,
  maintenance_end: null,
  maintenance_type: null,
  status: null,
  description: null,
  office_pkid: null,
  office_name: null,
};
