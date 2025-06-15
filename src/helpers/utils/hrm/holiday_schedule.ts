// Define the interface
export interface HolidayScheduleProperty {
  date: string;
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

// Initial state
export const holidayScheduleInitialState: HolidayScheduleProperty = {
  date: '',
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
