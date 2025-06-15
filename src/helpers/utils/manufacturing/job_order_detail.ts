export interface JobOrderDetailProperty {
  pkid: number | null;
  item_pkid: number | null;
  quantity: number | null;
  machine_hour: number | null;
  man_skill_quantity: number | null;
  epoch_time: number | null;
  progress: string | null;
  job_order_pkid: number | null;
  operation_pkid: number | null;
  machine_pkid: number | null;
  man_skill_pkid: number | null;
  work_centre_pkid: number | null;
}

export const jobOrderDetailInitialState: JobOrderDetailProperty = {
  pkid: null,
  item_pkid: null,
  quantity: null,
  machine_hour: null,
  man_skill_quantity: null,
  epoch_time: null,
  progress: null,
  job_order_pkid: null,
  operation_pkid: null,
  machine_pkid: null,
  man_skill_pkid: null,
  work_centre_pkid: null,
};
