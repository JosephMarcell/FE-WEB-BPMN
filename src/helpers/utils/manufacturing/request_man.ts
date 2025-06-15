export interface RequestManProperty {
  pkid: number | null;
  employee_pkid: number | null;
  cost_per_hour: number | null;
  start_date: Date | null;
  end_date: Date | null;
  is_fetched_by_hrm: boolean | null;
  job_order_detail_pkid: number | null;
}

export const requestManInitialState: RequestManProperty = {
  pkid: null,
  employee_pkid: null,
  cost_per_hour: null,
  start_date: null,
  end_date: null,
  is_fetched_by_hrm: null,
  job_order_detail_pkid: null,
};
