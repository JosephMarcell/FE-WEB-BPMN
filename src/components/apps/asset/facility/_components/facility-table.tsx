import { getTranslation } from '@/lib/lang/i18n';

import RenderDataTable from '@/components/commons/data-tables';

import { useSoftDeleteFacility } from '@/app/api/hooks/fixed_asset/facility/useSoftDeleteFacility';

const { t } = getTranslation();
interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const FacilityTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: t('facility_id') },
    { accessor: 'facility_name', title: t('facility_name') },
    {
      accessor: 'last_usage',
      title: t('last_usage') + ' (DD-MM-YYYY HH:MM:SS)',
    },
    { accessor: 'condition', title: t('condition') },
    { accessor: 'status', title: t('status') },
    { accessor: 'description', title: t('description') },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'action', title: t('action') },
  ];

  const { mutateAsync: deleteFacility } = useSoftDeleteFacility();

  return (
    <RenderDataTable
      title={t('facility')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      detailPath='/assets/facility/'
      deleteFunc={deleteFacility}
      action='RUD'
      refetch={refetch}
    />
  );
};

export default FacilityTable;
