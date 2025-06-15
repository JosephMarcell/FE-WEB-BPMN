import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteCharity } from '@/app/api/hooks/hrm/charity/useDeleteCharity';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const CharityTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteCharity } = useDeleteCharity();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'address', title: 'Address' },
    { accessor: 'amal_type', title: 'Type' },
    { accessor: 'amal_amount', title: 'Amount' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='Charity'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={deleteCharity}
      detailPath='/hrm/charity'
      action={permission}
    />
  );
};

export default CharityTable;
