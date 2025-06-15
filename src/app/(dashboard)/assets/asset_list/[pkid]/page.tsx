import { Metadata } from 'next';

import ComponentAssetDetail from '@/components/apps/asset/asset_list/component-asset-detail';

export const metadata: Metadata = {
  title: 'Asset List',
};
const AssetDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentAssetDetail pkid={params.pkid} />;
};

export default AssetDetailPage;
