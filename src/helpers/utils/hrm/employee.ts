export interface EmployeeProperty {
  // pkid: number | null;

  email: string | null;
  fullname: string | null;
  gender: string | null;
  req_id: number | null;
  user_id: number | null;
  join_date: string | null;
  position_id: number | null;
  ptkp_id: number | null;
  asuransi_id: number | null;
  amal_id: number | null;
  updated_ptkp_id: number | null;
  updated_ptkp_status: string;
  updated_ptkp_issue: string | null;
  verification_issue: string | null;
  nik: string | null;
  nip: string | null;
  npwp: string | null;
  alamat: string | null;
  phone: string | null;
  education: string | null;
  country_code: string | null;
  verification_state: string;
  active_status: string | null;
  inactive_since: string | null;
  FamilyMembers: FamilyMemberProperty[];
  Position: {
    WhitePayroll: {
      nama_golongan: string;
    } | null;
    name: string;
  };
}

export interface FamilyMemberProperty {
  pkid: number | null;
  employee_id: number | null;
  name: string;
  role: string;
  date_of_birth: string;
}

export const employeeInitialState: EmployeeProperty = {
  email: null,
  fullname: null,
  gender: null,
  req_id: null,
  user_id: null,
  join_date: null,
  position_id: null,
  ptkp_id: null,
  asuransi_id: null,
  amal_id: null,
  updated_ptkp_id: null,
  updated_ptkp_status: 'Tidak ada pengajuan',
  updated_ptkp_issue: null,
  verification_issue: null,
  nik: null,
  nip: null,
  npwp: null,
  alamat: null,
  phone: null,
  education: null,
  country_code: null,
  verification_state: 'Belum diverifikasi',
  active_status: null,
  inactive_since: null,
  FamilyMembers: [],
  Position: { name: '', WhitePayroll: null },
};

export const familyMemberInitialState: FamilyMemberProperty = {
  pkid: null,
  employee_id: null,
  name: '',
  role: '',
  date_of_birth: '',
};
