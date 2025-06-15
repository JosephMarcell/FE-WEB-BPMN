import { EmployeeProperty } from '@/helpers/utils/hrm/employee';

export interface SalaryListProperty {
  employee_id: number;
  gaji_pokok: number;
  gaji_lembur: number;
  penalti: number;
  deduction_asuransi_pribadi: number;
  deduction_amal: number;
  deduction_bpjs_kesehatan: number;
  tunjangan_jabatan: number;
  tunjangan_keluarga: number;
  deduction_bpjs_tk_jht: number;
  deduction_bpjs_tk_jp: number;
  deduction_pph21: number;
  benefit_bpjs_kesehatan: number;
  benefit_bpjs_tk_jht: number;
  benefit_bpjs_tk_jkk: number;
  benefit_bpjs_tk_jkm: number;
  benefit_bpjs_tk_jp: number;
  gaji_take_home: number;
  status: string | null;
  year: number;
  month: string | null;
  start_date: string | null;
  last_date: string | null;
  pkid: number;
  tenant: number;
  created_by: number;
  created_date: string | null;
  created_host: string | null;
  updated_by: number | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export interface SalarySlipProperty {
  employee_id: number;
  gaji_pokok: number;
  gaji_lembur: number;
  penalti: number;
  deduction_asuransi_pribadi: number;
  deduction_amal: number;
  deduction_bpjs_kesehatan: number;
  tunjangan_jabatan: number;
  tunjangan_keluarga: number;
  tunjangan_pph: number;
  deduction_bpjs_tk_jht: number;
  deduction_bpjs_tk_jp: number;
  deduction_pph21: number;
  benefit_bpjs_kesehatan: number;
  benefit_bpjs_tk_jht: number;
  benefit_bpjs_tk_jkk: number;
  benefit_bpjs_tk_jkm: number;
  benefit_bpjs_tk_jp: number;
  gaji_take_home: number;
  is_pph21_returned: boolean;
  status: string | null;
  year: number;
  month: string | null;
  start_date: string | null;
  last_date: string | null;
  Employee: EmployeeProperty | null;
}

export interface AllowanceProperty {
  pkid: number | null;
  amount: number;
  AllowanceName: {
    pkid: number | null;
    name: string | null;
    type: string | null;
  } | null;
}

export interface ReductionProperty {
  pkid: number | null;
  amount: number;
  ReductionName: {
    pkid: number | null;
    name: string | null;
  } | null;
}
export interface CountSalarySlipWhiteInput {
  employee_id: number;
  gaji_pokok: number;
  tunjangan_lain: number;
  pengurangan_lain: number;
  penalti: number;
  gaji_lembur: number;
  month: number;
  year: number;
}

export interface CountSalarySlipWhiteOutput {
  gaji_pokok: number;
  tunjangan_tetap_position: number;
  tunjangan_tetap_ptkp: number;
  tunjangan_pph: number;
  benefit_bpjs_kesehatan: number;
  benefit_bpjs_tk_jht: number;
  benefit_bpjs_tk_jkk: number;
  benefit_bpjs_tk_jkm: number;
  benefit_bpjs_tk_jp: number;
  deduction_asuransi_pribadi: number;
  deduction_amal: number;
  deduction_bpjs_kesehatan: number;
  deduction_bpjs_tk_jht: number;
  deduction_bpjs_tk_jp: number;
  deduction_pph21: number;
  penghasilanTetap: number;
  penghasilanBruto: number;
  takeHomePay: number;
}

export interface GetSalarySlipWhiteSummarized {
  salary_slip: SalarySlipProperty | null;
  allowances: AllowanceProperty[] | null;
  allowance_total: number;
  reductions: ReductionProperty[] | null;
  reduction_total: number;
  count_input: CountSalarySlipWhiteInput | null;
  count_output: CountSalarySlipWhiteOutput | null;
}

export interface CountSalarySlipBlueInput {
  employee_id: number;
  gaji_pokok: number;
  penalti: number;
  tunjangan_lain: number;
  pengurangan_lain: number;
  work_hour: number;
  start_date: Date;
  last_date: Date;
}

export interface CountSalarySlipBlueOutput {
  gaji_pokok: number;
  deduction_asuransi_pribadi: number;
  deduction_amal: number;
  deduction_pph21: number;
  penghasilanTetap: number;
  penghasilanBruto: number;
  takeHomePay: number;
}

export interface GetSalarySlipBlueSummarized {
  salary_slip: SalarySlipProperty | null;
  allowances: AllowanceProperty[];
  reductions: ReductionProperty[];
  input: CountSalarySlipBlueInput | null;
  output: CountSalarySlipBlueOutput | null;
}

export interface ViewSalarySlipWhite {
  pkid: number;
  fullname: string;
  month: string;
  year: number;
  gaji_take_home: number | string;
  benefit_bpjs_kesehatan: number | string;
  status: string;
}

export const salaryListInitialState: SalaryListProperty = {
  employee_id: 0,
  gaji_pokok: 0,
  gaji_lembur: 0,
  penalti: 0,
  deduction_asuransi_pribadi: 0,
  deduction_amal: 0,
  deduction_bpjs_kesehatan: 0,
  tunjangan_jabatan: 0,
  tunjangan_keluarga: 0,
  deduction_bpjs_tk_jht: 0,
  deduction_bpjs_tk_jp: 0,
  deduction_pph21: 0,
  benefit_bpjs_kesehatan: 0,
  benefit_bpjs_tk_jht: 0,
  benefit_bpjs_tk_jkk: 0,
  benefit_bpjs_tk_jkm: 0,
  benefit_bpjs_tk_jp: 0,
  gaji_take_home: 0,
  status: null,
  year: 2023,
  month: null,
  start_date: null,
  last_date: null,
  pkid: 1,
  tenant: 1,
  created_by: 19,
  created_date: null,
  created_host: null,
  updated_by: null,
  updated_date: null,
  updated_host: null,
  is_deleted: false,
  deleted_by: null,
  deleted_date: null,
  deleted_host: null,
};

export const allowanceInitialState: AllowanceProperty = {
  pkid: null,
  amount: 0,
  AllowanceName: null,
};

export const reductionInitialState: ReductionProperty = {
  pkid: null,
  amount: 0,
  ReductionName: null,
};

export const countSalarySlipWhiteOutputInitialState: CountSalarySlipWhiteOutput =
  {
    gaji_pokok: 0,
    tunjangan_tetap_position: 0,
    tunjangan_tetap_ptkp: 0,
    tunjangan_pph: 0,
    benefit_bpjs_kesehatan: 0,
    benefit_bpjs_tk_jht: 0,
    benefit_bpjs_tk_jkk: 0,
    benefit_bpjs_tk_jkm: 0,
    benefit_bpjs_tk_jp: 0,
    deduction_asuransi_pribadi: 0,
    deduction_amal: 0,
    deduction_bpjs_kesehatan: 0,
    deduction_bpjs_tk_jht: 0,
    deduction_bpjs_tk_jp: 0,
    deduction_pph21: 0,
    penghasilanTetap: 0,
    penghasilanBruto: 0,
    takeHomePay: 0,
  };

export const getSalarySlipWhiteSummarizedInitialState: GetSalarySlipWhiteSummarized =
  {
    salary_slip: null,
    allowances: null,
    allowance_total: 0,
    reductions: null,
    reduction_total: 0,
    count_input: null,
    count_output: null,
  };

export const getSalarySlipBlueSummarizedInitialState: GetSalarySlipBlueSummarized =
  {
    salary_slip: null,
    allowances: [],
    reductions: [],
    input: null,
    output: null,
  };
