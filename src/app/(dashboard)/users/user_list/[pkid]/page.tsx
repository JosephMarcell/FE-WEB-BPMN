import { Metadata } from 'next';

import ComponentUserDetail from '@/components/users/user_list/component-user-detail';

export const metadata: Metadata = {
  title: 'User Detail',
};

const UserDetailPage = ({ params }: { params: { pkid: string } }) => {
  return <ComponentUserDetail pkid={params.pkid} />;
};

export default UserDetailPage;
