export interface SalaryPercentageProperty {
  pkid: number;
  bpjs_kesehatan_type: string;
  bpjs_kesehatan_perusahaan: number;
  bpjs_kesehatan_pribadi: number;
  is_adding_bpjs_kesehatan: boolean;
  bpjs_ketenagakerjaan_jht_type: string;
  bpjs_ketenagakerjaan_jht_perusahaan: number;
  bpjs_ketenagakerjaan_jht_pribadi: number;
  is_adding_bpjs_ketenagakerjaan_jht: boolean;
  bpjs_ketenagakerjaan_jkk_type: string;
  bpjs_ketenagakerjaan_jkk_perusahaan: number;
  is_adding_bpjs_ketenagakerjaan_jkk: boolean;
  bpjs_ketenagakerjaan_jkm_type: string;
  bpjs_ketenagakerjaan_jkm_perusahaan: number;
  is_adding_bpjs_ketenagakerjaan_jkm: boolean;
  bpjs_ketenagakerjaan_jp_type: string;
  bpjs_ketenagakerjaan_jp_perusahaan: number;
  bpjs_ketenagakerjaan_jp_pribadi: number;
  is_adding_bpjs_ketenagakerjaan_jp: boolean;
}

export const salaryPercentageInitialState: SalaryPercentageProperty = {
  pkid: 0,
  bpjs_kesehatan_type: '',
  bpjs_kesehatan_perusahaan: 0,
  bpjs_kesehatan_pribadi: 0,
  is_adding_bpjs_kesehatan: false,
  bpjs_ketenagakerjaan_jht_type: '',
  bpjs_ketenagakerjaan_jht_perusahaan: 0,
  bpjs_ketenagakerjaan_jht_pribadi: 0,
  is_adding_bpjs_ketenagakerjaan_jht: false,
  bpjs_ketenagakerjaan_jkk_type: '',
  bpjs_ketenagakerjaan_jkk_perusahaan: 0,
  is_adding_bpjs_ketenagakerjaan_jkk: false,
  bpjs_ketenagakerjaan_jkm_type: '',
  bpjs_ketenagakerjaan_jkm_perusahaan: 0,
  is_adding_bpjs_ketenagakerjaan_jkm: false,
  bpjs_ketenagakerjaan_jp_type: '',
  bpjs_ketenagakerjaan_jp_perusahaan: 0,
  bpjs_ketenagakerjaan_jp_pribadi: 0,
  is_adding_bpjs_ketenagakerjaan_jp: false,
};
