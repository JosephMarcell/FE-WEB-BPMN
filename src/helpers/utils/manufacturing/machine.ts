export interface MachineProperty {
  asset_pkid: number | null;
  work_centre_pkid: string | null;
  cost_per_hour: number | null;
  description: string | null;
}

export const machineInitialState: MachineProperty = {
  asset_pkid: null,
  work_centre_pkid: null,
  description: null,
  cost_per_hour: null,
};
