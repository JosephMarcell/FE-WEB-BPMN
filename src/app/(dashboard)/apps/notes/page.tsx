import { Metadata } from 'next';
import React from 'react';

import ComponentsAppsNotes from '@/components/apps/notes/components-apps-notes';

export const metadata: Metadata = {
  title: 'Notes',
};

const Notes = () => {
  return <ComponentsAppsNotes />;
};

export default Notes;
