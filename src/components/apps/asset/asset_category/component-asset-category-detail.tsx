'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetCategoryDetailComponent from '@/components/apps/asset/asset_category/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetCategoryByPkid } from '@/app/api/hooks/fixed_asset/asset_category/useGetAssetCategoryByPkid';

interface IAssetCategoryDetail {
  pkid: number;
}
const ComponentAssetCategoryDetail = ({ pkid }: IAssetCategoryDetail) => {
  const pathname = usePathname();

  const { data: assetCategoryDetail, isLoading } =
    useGetAssetCategoryByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetCategoryDetailComponent data={assetCategoryDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetCategoryDetail;
