import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

interface BukpotWhiteData {
  pkid: number;
  employee_id: number;
  month: string;
  year: number;
  status: string;
  gaji_take_home: number;
  benefit_bpjs_kesehatan: number;
  fullname: string; // Ensure fullname is included
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const WhiteCollarSalarySlipTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'fullname', title: 'Employee' },
    { accessor: 'month', title: 'Month' },
    { accessor: 'year', title: 'Year' },
    { accessor: 'gaji_take_home', title: 'Gaji Take Home' },
    { accessor: 'ditanggung_perusahaan', title: 'Ditanggung Perusahaan' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='White Collar Salary Slip'
      data={data as unknown as BukpotWhiteData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={[]}
      detailPath='/hrm/payroll/white_collar_salary_slip'
      action='R'
    />
  );
};

export default WhiteCollarSalarySlipTable;
