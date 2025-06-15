'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetTransferDetailComponent from '@/components/apps/asset/asset_transfer/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetTransferByPkid } from '@/app/api/hooks/fixed_asset/asset_transfer/useGetAssetTransferByPkid';

interface IAssetTransferDetail {
  pkid: number;
}
const ComponentAssetTransferDetail = ({ pkid }: IAssetTransferDetail) => {
  const pathname = usePathname();

  const { data: assetTransferDetail, isLoading } =
    useGetAssetTransferByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetTransferDetailComponent data={assetTransferDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetTransferDetail;
