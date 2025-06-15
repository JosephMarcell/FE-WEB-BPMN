import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const RequestManTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'employee_pkid', title: 'Employee Name' },
    { accessor: 'cost_per_hour', title: 'Cost Per Hour' },
    { accessor: 'man_skill_pkid', title: 'Man Skill' },
    { accessor: 'start_date', title: 'Start Date' },
    { accessor: 'end_date', title: 'End Date' },
    { accessor: 'action', title: 'Action' },
  ];
  return (
    <RenderDataTable
      title='Request Man'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/manufacturing/request_man'
      action='R'
    />
  );
};

export default RequestManTable;
