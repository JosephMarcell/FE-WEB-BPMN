'use client';

import Cookies from 'js-cookie';
import React from 'react';
import { FaUserCog, FaUserMinus } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteUser } from '@/app/api/hooks/user_management/user/useDeleteUser';
import { useUpdateUserRole } from '@/app/api/hooks/user_management/user/useUpdateUserRole';

const { t } = getTranslation();

const UserTable = ({ data, isLoading, refetch }: any) => {
  interface MyData {
    [key: string]: any;
  }

  // Get current user role
  const currentUserRole = Cookies.get('userRole');
  const isSuperadmin = currentUserRole === 'SUPERADMIN';

  const { mutateAsync: deleteUserMutation } = useDeleteUser();
  const { mutateAsync: updateUserRoleMutation } = useUpdateUserRole();

  // Function to handle role change
  const handleRoleChange = async (userId: string, currentRole: string) => {
    // Determine the new role (opposite of current role)
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: `${
          newRole === 'ADMIN' ? 'Promote to Admin' : 'Demote to User'
        }?`,
        text: `Are you sure you want to change this user's role to ${newRole}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, change role',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        // Call API to update user role
        await updateUserRoleMutation({ userId, role: newRole });

        // Show success message
        Swal.fire({
          title: 'Role Updated',
          text: `User role has been changed to ${newRole}`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Refresh the user list
          refetch?.();
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Swal.fire('Error!', 'Failed to update user role', 'error');
    }
  };

  // Handle delete user function (existing function)
  const handleDeleteUser = async (id: string | number) => {
    try {
      console.log('Delete Function Triggered');
      console.log('ID Received:', id);
      console.log('ID Type:', typeof id);

      // Convert id to string if it's a number
      const userId = typeof id === 'string' ? id : String(id);
      console.log('Converted userId:', userId);

      // Jika ID numerik (baris tabel), cari UUID yang sesuai
      if (typeof id === 'number') {
        console.log(
          'Numeric ID detected, finding corresponding user with pkid:',
          id,
        );
        console.log('Available data:', data);

        const user = data.find((user: any) => user.pkid === id);
        console.log('Found user:', user);

        if (user && user.id) {
          console.log('Found UUID in user data:', user.id);
          await deleteUserMutation(user.id);
          console.log('Delete mutation executed with UUID:', user.id);
          Swal.fire(t('deleted'), t('user_deleted_success'), 'success').then(
            () => {
              refetch?.();
            },
          );
          return;
        } else {
          console.log('No user found with pkid:', id);
        }
      }

      // Langsung gunakan ID jika itu sudah UUID string
      console.log('Using ID directly as UUID:', userId);
      await deleteUserMutation(userId);
      console.log('Delete mutation executed successfully');
      Swal.fire(t('deleted'), t('user_deleted_success'), 'success').then(() => {
        refetch?.();
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error!', t('error_occurred'), 'error');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'SUPERADMIN') return 'bg-dark';
    else if (role === 'ADMIN') return 'bg-primary';
    else if (role === 'SUPERVISOR') return 'bg-warning';
    else return 'bg-info';
  };

  // Updated columns to match the API structure
  const cols = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'user_name', title: t('username') }, // Ubah ke user_name sesuai API
    { accessor: 'email', title: t('email') },
    ...(data && data.some((user: any) => user.alamat)
      ? [{ accessor: 'alamat', title: t('alamat') }]
      : []),
    ...(data && data.some((user: any) => user.latitude)
      ? [{ accessor: 'latitude', title: t('latitude') }]
      : []),
    ...(data && data.some((user: any) => user.longitude)
      ? [{ accessor: 'longitude', title: t('longitude') }]
      : []),
    {
      accessor: 'role',
      title: t('role'),
      render: (row: any) => (
        <span className={`badge ${getRoleBadgeColor(row.role)}`}>
          {row.role || 'Unknown'}
        </span>
      ),
    },
    // New column for role management (only visible for SUPERADMIN)
    {
      accessor: 'role_management',
      title: 'Role Management',
      hidden: !isSuperadmin,
      render: (row: any) => {
        // Don't show controls for superadmin users or the current user
        if (row.role === 'SUPERADMIN' || row.id === Cookies.get('userId')) {
          return <span className='text-gray-400'>-</span>;
        }

        return (
          <button
            onClick={() => handleRoleChange(row.id, row.role)}
            className={`btn btn-sm ${
              row.role === 'ADMIN' ? 'btn-warning' : 'btn-primary'
            }`}
            title={row.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
          >
            {row.role === 'ADMIN' ? (
              <>
                <FaUserMinus className='mr-1' /> Demote
              </>
            ) : (
              <>
                <FaUserCog className='mr-1' /> Promote
              </>
            )}
          </button>
        );
      },
    },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title={t('user_list')}
      data={data}
      columns={cols}
      isLoading={isLoading}
      deleteFunc={handleDeleteUser}
      detailPath='/users/user_list'
      refetch={refetch}
      hide_columns={[
        'id',
        ...(data && !data.some((user: any) => user.alamat) ? ['alamat'] : []),
        ...(data && !data.some((user: any) => user.latitude)
          ? ['latitude']
          : []),
        ...(data && !data.some((user: any) => user.longitude)
          ? ['longitude']
          : []),
        ...(isSuperadmin ? [] : ['role_management']), // Hide role management for non-superadmins
      ]}
      action='RUD'
    />
  );
};

export default UserTable;
