import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteInsurance } from '@/app/api/hooks/hrm/insurance/useDeleteInsurance';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const InsuranceTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteInsurance } = useDeleteInsurance();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'address', title: 'Address' },
    { accessor: 'phone', title: 'Phone' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'asuransi_type', title: 'Type' },
    { accessor: 'asuransi_amount', title: 'Amount' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='Insurance'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={deleteInsurance}
      detailPath='/hrm/insurance'
      action={permission}
    />
  );
};

export default InsuranceTable;
