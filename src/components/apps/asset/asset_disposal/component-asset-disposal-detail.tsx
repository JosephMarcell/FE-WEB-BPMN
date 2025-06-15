'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetDisposalDetailComponent from '@/components/apps/asset/asset_disposal/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetDisposalByPkid } from '@/app/api/hooks/fixed_asset/asset_disposal/useGetAssetDisposalByPkid';

interface IAssetDisposalDetail {
  pkid: number;
}
const ComponentAssetDisposalDetail = ({ pkid }: IAssetDisposalDetail) => {
  const pathname = usePathname();

  const { data: assetDisposalDetail, isLoading } =
    useGetAssetDisposalByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetDisposalDetailComponent data={assetDisposalDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetDisposalDetail;
