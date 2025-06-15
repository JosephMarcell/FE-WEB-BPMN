import { Metadata } from 'next';

import ComponentsEndOfMonth from '@/components/apps/general_ledger/end_of_month/component-end-of-month';

export const metadata: Metadata = {
  title: 'End Of Month',
};
const EndOfMonthPage = () => {
  return <ComponentsEndOfMonth />;
};

export default EndOfMonthPage;
