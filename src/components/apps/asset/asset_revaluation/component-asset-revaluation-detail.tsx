'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetRevaluationDetailComponent from '@/components/apps/asset/asset_revaluation/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetRevaluationByPkid } from '@/app/api/hooks/fixed_asset/asset_revaluation/useGetAssetRevaluationByPkid';

interface IAssetRevaluationDetail {
  pkid: number;
}
const ComponentAssetRevaluationDetail = ({ pkid }: IAssetRevaluationDetail) => {
  const pathname = usePathname();

  const { data: assetRevaluationDetail, isLoading } =
    useGetAssetRevaluationByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetRevaluationDetailComponent data={assetRevaluationDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetRevaluationDetail;
