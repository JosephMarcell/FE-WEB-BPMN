import { Metadata } from 'next';
import React from 'react';

import ComponentJournalDetail from '@/components/apps/general_ledger/journal_management/component-journal-detail';

export const metadata: Metadata = {
  title: 'Asset Category',
};
const JournalDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentJournalDetail pkid={params.pkid} />;
};

export default JournalDetailPage;
