'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetMaintenanceDetailComponent from '@/components/apps/asset/maintenance_log/_components/detail-page';
import LoadingDetailPage from '@/components/commons/loading-detail-page';

import { useGetAssetMaintenanceByPkid } from '@/app/api/hooks/fixed_asset/maintenance_log/useGetAssetMaintenanceByAssetId';

interface IAssetMaintenanceDetail {
  pkid: number;
}
const ComponentAssetMaintenanceDetail = ({ pkid }: IAssetMaintenanceDetail) => {
  const pathname = usePathname();

  const { data: assetMaintenanceDetail, isLoading } =
    useGetAssetMaintenanceByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        {isLoading ? (
          <LoadingDetailPage />
        ) : (
          <AssetMaintenanceDetailComponent data={assetMaintenanceDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentAssetMaintenanceDetail;
