export interface PositionProperty {
  pkid: number;
  name: string | null;
  department_id: string | null;
  tunjangan_tetap: string | number;
  white_payroll_id: number | null;
  blue_cost_ph: string | number | null;
  Department: {
    name: string | null;
  };
  type: string | null;
  description: string | null;
}

export const positionInitialState: PositionProperty = {
  pkid: 0,
  name: null,
  department_id: null,
  tunjangan_tetap: 0,
  white_payroll_id: null,
  blue_cost_ph: null,
  Department: {
    name: null,
  },
  type: null,
  description: null,
};
