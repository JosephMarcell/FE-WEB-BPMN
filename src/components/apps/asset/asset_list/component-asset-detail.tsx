'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetDetailComponent from '@/components/apps/asset/asset_list/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetById } from '@/app/api/hooks/fixed_asset/asset_list/useGetAssetById';

interface IAssetDetail {
  pkid: number;
}
const ComponentAssetDetail = ({ pkid }: IAssetDetail) => {
  const pathname = usePathname();

  const { data: assetDetail, isLoading } = useGetAssetById(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetDetailComponent data={assetDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetDetail;
