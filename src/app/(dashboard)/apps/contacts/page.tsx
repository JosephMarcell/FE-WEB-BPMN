import { Metadata } from 'next';
import React from 'react';

import ComponentsAppsContacts from '@/components/apps/contacts/components-apps-contacts';

export const metadata: Metadata = {
  title: 'Contacts',
};

const Contacts = () => {
  return <ComponentsAppsContacts />;
};

export default Contacts;
