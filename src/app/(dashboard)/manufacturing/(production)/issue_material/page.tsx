import { Metadata } from 'next';

import ComponentsIssueMaterial from '@/components/apps/manufacturing/production/issue_material/component-issue-material';

export const metadata: Metadata = {
  title: 'Issue Material',
};

const IssueMaterialPage = () => {
  return <ComponentsIssueMaterial />;
};

export default IssueMaterialPage;
