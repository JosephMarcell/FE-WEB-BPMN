import { Metadata } from 'next';

import ComponentsTransferMaterial from '@/components/apps/manufacturing/production/transfer_material/component-transfer-material';

export const metadata: Metadata = {
  title: 'Transfer Material',
};

const TransferMaterialPage = () => {
  return <ComponentsTransferMaterial />;
};

export default TransferMaterialPage;
