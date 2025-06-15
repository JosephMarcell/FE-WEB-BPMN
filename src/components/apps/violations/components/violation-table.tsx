import { getTranslation } from '@/lib/lang/i18n';

import RenderDataTable from '@/components/commons/data-tables';

import { useSoftDeleteViolation } from '@/app/api/hooks/violations/useSoftDeleteViolation';

const { t } = getTranslation();
interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
  refetch?: () => void;
}
const ViolationTable = <T extends object>({
  data,
  isLoading,
  pagination,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteViolations } = useSoftDeleteViolation();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'report_title', title: t('report_title') },
    { accessor: 'reported_at', title: t('reported_at') },
    { accessor: 'status', title: t('status') },
    { accessor: 'severity', title: t('severity') },
    { accessor: 'violation_type', title: t('violation_type') },
    { accessor: 'description', title: t('description') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <RenderDataTable
      title={t('violations')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      detailPath='/violations'
      action='RD'
      refetch={refetch}
      deleteFunc={deleteViolations}
      pagination={pagination} // Pass pagination to RenderDataTable
    />
  );
};

export default ViolationTable;
