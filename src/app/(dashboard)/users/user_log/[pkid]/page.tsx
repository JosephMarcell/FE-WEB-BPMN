import { Metadata } from 'next';

import ComponentEachActivityLog from '@/components/users/user_log/components-users-log-list-detail';
export const metadata: Metadata = {
  title: 'User Log Details',
};
const UserDetailPage = ({ params }: { params: { username: string } }) => {
  return <ComponentEachActivityLog username={params.username} />;
};

export default UserDetailPage;
