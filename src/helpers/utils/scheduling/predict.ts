export interface PredictProperty {
  item_pkid: number | null;
  quantity: number | null;
}

export const predictProductionInitialState: PredictProperty = {
  item_pkid: null,
  quantity: null,
};

interface Employee {
  pkid: number;
  position_id: number;
  name: string;
  nip: string;
  end_date: string;
  man_skill_pkid: number;
}

export interface PredictResultProperty {
  name: string;
  id: number;
  order: number;
  start: string;
  finish: string;
  employee_id: Employee[];
}
