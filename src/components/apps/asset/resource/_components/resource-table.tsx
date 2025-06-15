import { getTranslation } from '@/lib/lang/i18n';

import RenderDataTable from '@/components/commons/data-tables';

import { useSoftDeleteResource } from '@/app/api/hooks/fixed_asset/resource/useSoftDeleteResource';

const { t } = getTranslation();
interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const ResourceTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteResource } = useSoftDeleteResource();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'asset_code', title: t('asset_code') },
    { accessor: 'resource_name', title: t('resource_name') },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'description', title: t('description') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <RenderDataTable
      title={t('resources')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      detailPath='/assets/resource'
      action='RUD'
      refetch={refetch}
      deleteFunc={deleteResource}
    />
  );
};

export default ResourceTable;
