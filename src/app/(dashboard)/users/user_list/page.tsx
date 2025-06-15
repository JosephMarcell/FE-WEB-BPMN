import { Metadata } from 'next';
import React from 'react';

import ComponentsUsersList from '@/components/users/user_list/components-users-list';

export const metadata: Metadata = {
  title: 'User List',
};

const UserList = () => {
  return <ComponentsUsersList />;
};

export default UserList;
