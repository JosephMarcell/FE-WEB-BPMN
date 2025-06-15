export interface ConfigurationProperty {
  white_start_time: string;
  white_work_duration: string;
  white_working_days_per_week: number | null;
  white_is_penalty_given: boolean | null;
  white_is_tunjangan_pph: boolean | null;
  white_late_time_tolerance: string;
  white_late_salary_penalty_ph: number | null;
  white_late_salary_penalty_type: string;
  blue_is_penalty_given: boolean | null;
  blue_late_time_tolerance: string;
  blue_late_salary_penalty_ph: number | null;
  blue_late_salary_penalty_type: string;
  pkid: number | null;
  tenant: number | null;
  created_by: number | null;
  created_date: string;
  created_host: string;
  updated_by: number | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export const configurationInitialState: ConfigurationProperty = {
  white_start_time: '',
  white_work_duration: '',
  white_working_days_per_week: null,
  white_is_penalty_given: null,
  white_is_tunjangan_pph: null,
  white_late_time_tolerance: '',
  white_late_salary_penalty_ph: null,
  white_late_salary_penalty_type: '',
  blue_is_penalty_given: null,
  blue_late_time_tolerance: '',
  blue_late_salary_penalty_ph: null,
  blue_late_salary_penalty_type: '',
  pkid: null,
  tenant: null,
  created_by: null,
  created_date: '',
  created_host: '',
  updated_by: null,
  updated_date: null,
  updated_host: null,
  is_deleted: false,
  deleted_by: null,
  deleted_date: null,
  deleted_host: null,
};
