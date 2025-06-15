import { getTranslation } from '@/lib/lang/i18n';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useSoftDeleteAssetMaintenanceLog } from '@/app/api/hooks/fixed_asset/maintenance_log/useSoftDeleteAssetMaintenanceLog';
import { useDownloadActivityLogCSV } from '@/app/api/hooks/user_management/user_log/useDownloadCSV';
import { useDownloadActivityLogPDF } from '@/app/api/hooks/user_management/user_log/useDownloadPDF';

const { t } = getTranslation();

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const EachUserActivityTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetMaintenanceLog } =
    useSoftDeleteAssetMaintenanceLog();
  const { downloadCSV } = useDownloadActivityLogCSV();
  const { downloadPDF } = useDownloadActivityLogPDF();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'actor_username', title: t('username') },
    { accessor: 'actor_role', title: t('role') },
    { accessor: 'action_type', title: t('action_type') },
    { accessor: 'action_time', title: t('action_time') },
    { accessor: 'office', title: t('office') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <RenderHRMDataTable
      title={t('each_user_activity')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      deleteFunc={deleteAssetMaintenanceLog}
      detailPath='/assets/maintenance_log'
      exportCSV={downloadCSV}
      exportPDF={downloadPDF}
      action='D'
      refetch={refetch}
    />
  );
};

export default EachUserActivityTable;
