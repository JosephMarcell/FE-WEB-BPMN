export interface OperationProperty {
  name: string | null;
  description: string | null;
  item_max: number | null;
  machine_hour: number | null;
  man_skill_quantity: number | null;
  machine_pkid: number | null;
  man_skill_pkid: number | null;
  work_centre_pkid: number | null;
  item_pkid: number | null;
}

export const operationInitialState: OperationProperty = {
  name: null,
  description: null,
  item_max: null,
  machine_hour: null,
  man_skill_quantity: null,
  machine_pkid: null,
  man_skill_pkid: null,
  work_centre_pkid: null,
  item_pkid: null,
};
