import { getTranslation } from '@/lib/lang/i18n';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useSoftDeleteUser } from '@/app/api/hooks/user_management/user/useSoftDeleteUser';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const { t } = getTranslation();

const UserActivityTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteUser } = useSoftDeleteUser();
  const cols = [
    { accessor: 'user_pkid', title: 'ID' },
    { accessor: 'username', title: t('username') },
    { accessor: 'email', title: 'Email' },
    { accessor: 'role_name', title: t('role') },
    { accessor: 'office_name', title: t('office') },
    { accessor: 'log_count', title: t('log_count') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <RenderHRMDataTable
      title={t('user_log')}
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={deleteUser}
      detailPath='/users/user_log'
      action='L'
    />
  );
};

export default UserActivityTable;
