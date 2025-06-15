import { EmployeeProperty } from '@/helpers/utils/hrm/employee';

export interface WhiteCollarWitholdCertificateProperty {
  pkid: number;
  employee_id: number;
  pemotong: string | null;
  ptkp_id: number;
  year: number;
  gaji: number;
  tunjangan_pph: number;
  tunjangan_lain: number;
  honorarium_imbalan: number;
  premi_asuransi: number;
  natura: number;
  gratifikasi_thr: number;
  biaya_jabatan_pensiun: number;
  iuran_pensiun: number;
  neto_sebelum: number;
  pajak: number;
  pajak_telah_dipotong: number;
  pajak_lunas: number;
  status: string;
  Employee: EmployeeProperty | null;
}

export interface CountBukpotWhiteOutput {
  gaji: number;
  tunjangan_pph: number;
  tunjangan_lain_uang_lembur: number;
  honorarium: number;
  asuransi_diberi_pekerja: number;
  natura: number;
  bonus: number;
  biaya_jabatan: number;
  iuran_pensiun_asuransi_sendiri: number;
  penghasilan_netto: number;
  ptkp: number;
  pkp: number;
  amal_amount: number;
  yearly_pph21: number;
  last_month_pph21: number;
  paid_pph21: number;
  is_last_month: boolean;
}

export interface CountNettoWhiteOutput {
  ptkp: number;
  pkp: number;
  yearly_pph21: number;
}

export interface BukpotWhiteResult {
  data: WhiteCollarWitholdCertificateProperty | null;
  count: {
    bukpotOutput: CountBukpotWhiteOutput | null;
    nettoOutput: CountNettoWhiteOutput | null;
  };
}

export const whiteCollarWitholdCertificateInitialState: WhiteCollarWitholdCertificateProperty =
  {
    pkid: 0,
    employee_id: 0,
    pemotong: null,
    ptkp_id: 0,
    year: 0,
    gaji: 0,
    tunjangan_pph: 0,
    tunjangan_lain: 0,
    honorarium_imbalan: 0,
    premi_asuransi: 0,
    natura: 0,
    gratifikasi_thr: 0,
    biaya_jabatan_pensiun: 0,
    iuran_pensiun: 0,
    neto_sebelum: 0,
    pajak: 0,
    pajak_telah_dipotong: 0,
    pajak_lunas: 0,
    status: 'Not Verified',
    Employee: null,
  };

export const countBukpotWhiteOutputInitialState: CountBukpotWhiteOutput = {
  gaji: 0,
  tunjangan_pph: 0,
  tunjangan_lain_uang_lembur: 0,
  honorarium: 0,
  asuransi_diberi_pekerja: 0,
  natura: 0,
  bonus: 0,
  biaya_jabatan: 0,
  iuran_pensiun_asuransi_sendiri: 0,
  penghasilan_netto: 0,
  ptkp: 0,
  pkp: 0,
  amal_amount: 0,
  yearly_pph21: 0,
  last_month_pph21: 0,
  paid_pph21: 0,
  is_last_month: false,
};

export const countNettoWhiteOutputInitialState: CountNettoWhiteOutput = {
  ptkp: 0,
  pkp: 0,
  yearly_pph21: 0,
};

export const bukpotWhiteResultInitialState: BukpotWhiteResult = {
  data: null,
  count: {
    bukpotOutput: null,
    nettoOutput: null,
  },
};
