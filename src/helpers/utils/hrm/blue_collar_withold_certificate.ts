import { EmployeeProperty } from '@/helpers/utils/hrm/employee';

export interface BlueCollarWitholdCertificateProperty {
  employee_id?: number;
  pemotong: string | null;
  month?: string | null;
  year?: number;
  penghasilan_bruto?: number;
  tarif?: number;
  pph_dipotong?: number;
  status?: string | null;
  pkid?: number;
  Employee?: EmployeeProperty | null;
}

export const blueCollarWitholdCertificateInitialState: BlueCollarWitholdCertificateProperty =
  {
    employee_id: 0,
    pemotong: null,
    month: null,
    year: 0,
    penghasilan_bruto: 0,
    tarif: 0,
    pph_dipotong: 0,
    status: null,
    pkid: 0,
    Employee: null,
  };
