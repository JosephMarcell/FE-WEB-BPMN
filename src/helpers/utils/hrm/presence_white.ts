export interface PresenceWhiteProperty {
  pkid: number | null;
  employee_id: number | null;
  presence: string | null;
  date: Date | null;
  check_in: Date | null;
  check_out: Date | null;
  event_description: string | null;
}

export const presenceWhiteInitialState: PresenceWhiteProperty = {
  pkid: null,
  employee_id: null,
  presence: null,
  date: null,
  check_in: null,
  check_out: null,
  event_description: null,
};

export interface CountHourPresenceWhiteInputProperty {
  employee_id: number | null;
  month: number | null;
  year: number | null;
}

export interface CountHourPresenceWhiteOutputProperty {
  countInput: {
    workNormalHour: number;
    penaltiHours: number;
    overtimeHariKerjaHours: number;
    overtimeHariLiburHours: number;
    overtimeLiburNasionalHours: number;
  };
}
