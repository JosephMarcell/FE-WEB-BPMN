import { MachineProperty } from '@/helpers/utils/manufacturing/machine';
import { ManProperty } from '@/helpers/utils/manufacturing/man';
import { OperationProperty } from '@/helpers/utils/manufacturing/operation';

export interface ScheduleProperty {
  start_date: Date | null;
  end_date: Date | null;
  job_order_detail_pkid: number | null;
  job_order_pkid?: number | null;
  operation_name: string | null;
  color: string | null;
  job_order_detail?: {
    Machine: MachineProperty;
    ManSkill: ManProperty;
    Operation: OperationProperty;
  };
}

export const scheduleInitialState: ScheduleProperty = {
  start_date: null,
  end_date: null,
  job_order_detail_pkid: null,
  job_order_pkid: null,
  operation_name: null,
  color: null,
};
