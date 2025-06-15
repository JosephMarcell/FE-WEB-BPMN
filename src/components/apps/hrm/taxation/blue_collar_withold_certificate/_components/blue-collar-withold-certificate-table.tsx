import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

interface BukpotBlueData {
  pkid: number;
  employee_id: number;
  fullname: string;
  month: string;
  year: number;
  status: string;
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const BlueCollarWitholdCertificateTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'fullname', title: 'Employee' },
    { accessor: 'month', title: 'Month' },
    { accessor: 'status', title: 'Year' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='Blue Collar Withold Certificate'
      data={data as unknown as BukpotBlueData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={[]}
      detailPath='/hrm/taxation/blue_collar_withold_certificate/'
      action='R'
    />
  );
};

export default BlueCollarWitholdCertificateTable;
