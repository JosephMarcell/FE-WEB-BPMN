export interface OvertimeProperty {
  type: string;
  jam_pertama: number | null;
  overtime_rate_ph: number | null;
  overtime_rate_type: string;
  pkid: number | null;
  tenant: number | null;
  created_by: number;
  created_date: string;
  created_host: string;
  updated_by: number | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: number | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export const initialOvertimeState: OvertimeProperty = {
  type: '',
  jam_pertama: null,
  overtime_rate_ph: null,
  overtime_rate_type: '',
  pkid: null,
  tenant: null,
  created_by: 0,
  created_date: '',
  created_host: '',
  updated_by: null,
  updated_date: null,
  updated_host: null,
  is_deleted: null,
  deleted_by: null,
  deleted_date: null,
  deleted_host: null,
};
