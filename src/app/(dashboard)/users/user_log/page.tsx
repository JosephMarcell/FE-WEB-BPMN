import { Metadata } from 'next';
import React from 'react';

import ComponentsUsersActivityList from '@/components/users/user_log/components-users-log-list';

export const metadata: Metadata = {
  title: 'User Log',
};

const UserList = () => {
  return <ComponentsUsersActivityList />;
};

export default UserList;
