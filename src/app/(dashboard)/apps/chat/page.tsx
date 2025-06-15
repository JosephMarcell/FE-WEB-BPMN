import { Metadata } from 'next';
import React from 'react';

import ComponentsAppsChat from '@/components/apps/chat/components-apps-chat';

export const metadata: Metadata = {
  title: 'Chat',
};

const Chat = () => {
  return (
    <>
      <ComponentsAppsChat />;
    </>
  );
};

export default Chat;
