import { getTranslation } from '@/lib/lang/i18n';

import RenderDataTable from '@/components/commons/data-tables';

import { useSoftDeleteAssetMaintenanceLog } from '@/app/api/hooks/fixed_asset/maintenance_log/useSoftDeleteAssetMaintenanceLog';

const { t } = getTranslation();

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const MaintenanceTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetMaintenanceLog } =
    useSoftDeleteAssetMaintenanceLog();
  const cols = [
    { accessor: 'pkid', title: t('maintenance_id') },
    { accessor: 'model_name', title: t('model_name') },
    { accessor: 'model_type', title: t('model_type') },
    { accessor: 'user_name', title: t('user_name') },
    {
      accessor: 'maintenance_start',
      title: t('maintenance_start_date') + '(DD-MM-YYYY)',
    },
    {
      accessor: 'maintenance_end',
      title: t('maintenance_end_date') + '(DD-MM-YYYY)',
    },
    { accessor: 'maintenance_type', title: t('maintenance_type') },
    { accessor: 'status', title: 'Status' },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <RenderDataTable
      title={t('maintenance_log')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      detailPath='/assets/maintenance_log'
      action='EDLR'
      deleteFunc={deleteAssetMaintenanceLog}
      refetch={refetch}
    />
  );
};

export default MaintenanceTable;
