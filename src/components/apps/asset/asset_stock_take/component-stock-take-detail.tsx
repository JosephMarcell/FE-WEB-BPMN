'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetStockTakeDetailComponent from '@/components/apps/asset/asset_stock_take/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetStockTakeByPkid } from '@/app/api/hooks/fixed_asset/asset_stock_take/useGetAssetStockTakeByPkid';

interface IAssetStockTakeDetail {
  pkid: number;
}
const ComponentAssetStockTakeDetail = ({ pkid }: IAssetStockTakeDetail) => {
  const pathname = usePathname();

  const { data: assetStockTakeDetail, isLoading } =
    useGetAssetStockTakeByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetStockTakeDetailComponent data={assetStockTakeDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetStockTakeDetail;
