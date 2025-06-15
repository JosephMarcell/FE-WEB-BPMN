import { Metadata } from 'next';

import ComponentsJournal from '@/components/apps/general_ledger/journal_management/component-journal';

export const metadata: Metadata = {
  title: 'Journal Management',
};
const JournalManagementPage = () => {
  return <ComponentsJournal />;
};

export default JournalManagementPage;
