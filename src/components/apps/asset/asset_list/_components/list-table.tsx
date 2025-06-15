import { getTranslation } from '@/lib/lang/i18n';

import RenderDataTable from '@/components/commons/data-tables';

import { useSoftDeleteAsset } from '@/app/api/hooks/fixed_asset/asset_list/useSoftDeleteAsset';

const { t } = getTranslation();

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const AssetTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAsset } = useSoftDeleteAsset();
  const cols = [
    { accessor: 'asset_code', title: 'Asset ID' },
    { accessor: 'asset_type', title: 'Tipe' },
    { accessor: 'office_name', title: 'Kantor' },
    {
      accessor: 'last_usage',
      title: 'Pemakaian Terakhir (DD-MM-YYYY HH:MM:SS)',
    },
    { accessor: 'status', title: 'Status' },
    { accessor: 'purchase_date', title: 'Tanggal Pembelian (DD-MM-YYYY)' },
    { accessor: 'condition', title: 'Kondisi' },
    { accessor: 'action', title: 'Aksi' },
  ];

  return (
    <RenderDataTable
      title={t('asset_list')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={deleteAsset}
      detailPath='/assets/asset_list/'
      action='RUDL'
    />
  );
};

export default AssetTable;
