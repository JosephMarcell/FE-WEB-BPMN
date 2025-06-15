'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdEdit, MdPersonAdd } from 'react-icons/md';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';
import ModalInviteUserByEmail from '@/components/tenants/_components/modal-invite-user-by-email';
import ModalUpdateTenant from '@/components/tenants/_components/modal-update-tenant';

import { useGetAdminTenant } from '@/app/api/hooks/tenant/useGetAdminTenant';
import { useGetAdminTenantUsers } from '@/app/api/hooks/tenant/useGetAdminTenantUsers';
import { useRemoveTenantUser } from '@/app/api/hooks/tenant/useRemoveTenantUser';

const MyTenantPage = () => {
  const router = useRouter();
  const userRole = Cookies.get('userRole');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Check if user is authorized
  useEffect(() => {
    if (userRole !== 'ADMIN') {
      router.push('/');
      Swal.fire({
        title: 'Unauthorized',
        text: 'You do not have permission to access this page',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }, [userRole, router]);

  // Get tenant details and users
  const {
    data: tenantData,
    isLoading: isTenantLoading,
    error: tenantError,
    refetch: refetchTenant,
  } = useGetAdminTenant();
  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useGetAdminTenantUsers();
  const { mutateAsync: removeTenantUser } = useRemoveTenantUser();

  // Handle removing a user from tenant
  const handleRemoveUser = async (userId: string | number) => {
    console.log('=== HANDLE REMOVE USER ===');
    console.log('Raw userId received:', userId);
    console.log('Type:', typeof userId);

    // Pastikan userId adalah string (UUID)
    const userIdString = String(userId);
    console.log('Converted to string:', userIdString);

    try {
      const result = await Swal.fire({
        title: 'Remove User',
        text: 'Are you sure you want to remove this user from your tenant?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        console.log('=== CALLING API ===');
        console.log('Calling removeTenantUser with:', userIdString);

        await removeTenantUser(userIdString);

        Swal.fire({
          title: 'Success',
          text: 'User has been removed from the tenant',
          icon: 'success',
        }).then(() => {
          refetchUsers();
        });
      }
    } catch (error: any) {
      console.error('=== ERROR REMOVING USER ===');
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);

      let errorMessage = 'Failed to remove user from tenant';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });
    }
  };

  // Handle errors
  if (tenantError) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='dark:bg-navy-700 rounded-lg bg-white p-8 shadow-md'>
          <h2 className='mb-4 text-center text-2xl font-bold'>Error</h2>
          <p className='mb-6 text-center text-gray-600 dark:text-gray-400'>
            Failed to load tenant information. Please try again later.
          </p>
          <div className='flex justify-center'>
            <button
              onClick={() => router.push('/')}
              className='btn btn-primary'
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Define columns for users table
  const userColumns = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'username', title: 'Username' },
    { accessor: 'email', title: 'Email' },
    {
      accessor: 'user_role',
      title: 'Role',
      render: (row: any) => {
        const getRoleBadgeColor = (user_role: string): string => {
          switch (user_role?.toUpperCase()) {
            case 'SUPERADMIN':
              return 'bg-black';
            case 'ADMIN':
              return 'bg-primary';
            case 'SUPERVISOR':
              return 'bg-warning';
            case 'USER':
              return 'bg-info';
            default:
              return 'bg-secondary';
          }
        };

        return (
          <span className={`badge ${getRoleBadgeColor(row.user_role)}`}>
            {row.user_role || 'Unknown'}
          </span>
        );
      },
    },
    {
      accessor: 'is_verified',
      title: 'Status',
      render: (row: any) => (
        <span
          className={`badge ${row.is_verified ? 'bg-success' : 'bg-danger'}`}
        >
          {row.is_verified ? 'Verified' : 'Not Verified'}
        </span>
      ),
    },
    { accessor: 'action', title: 'Action' },
  ];

  const tenant = tenantData?.data;
  const isLoading = isTenantLoading || isUsersLoading;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Detail Tenant</h1>

        {/* Edit Tenant Button */}
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className='btn btn-primary flex items-center gap-2'
        >
          <MdEdit />
          Update Tenant
        </button>
      </div>

      {isLoading ? (
        <div className='panel p-5'>
          <div className='flex h-64 items-center justify-center'>
            <div className='border-primary h-10 w-10 animate-spin rounded-full border-b-2'></div>
          </div>
        </div>
      ) : (
        <>
          {/* Tenant Info Panel */}
          <div className='panel'>
            <div className='mb-5 border-b border-gray-200 p-4 dark:border-gray-700'>
              <h2 className='text-xl font-bold'>{tenant?.name}</h2>
              <p className='text-gray-500'>{tenant?.description}</p>
            </div>

            {/* Tenant Details */}
            <div className='grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3'>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Contact Email</span>
                <span className='font-medium'>{tenant?.contact_email}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Contact Phone</span>
                <span className='font-medium'>
                  {tenant?.contact_phone || 'N/A'}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Subscription Plan</span>
                <span className='font-medium'>{tenant?.subscription_plan}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>
                  Subscription Start
                </span>
                <span className='font-medium'>
                  {tenant?.subscription_start_date
                    ? new Date(
                        tenant.subscription_start_date,
                      ).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Subscription End</span>
                <span className='font-medium'>
                  {tenant?.subscription_end_date
                    ? new Date(
                        tenant.subscription_end_date,
                      ).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Max Users</span>
                <span className='font-medium'>{tenant?.max_users}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Status</span>
                <span
                  className={`badge ${
                    tenant?.is_active ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {tenant?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className='panel p-0'>
            <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
              <div>
                <h3 className='text-lg font-bold'>Users in {tenant?.name}</h3>
                <p className='text-sm text-gray-500'>
                  Manage users in your tenant
                </p>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className='btn btn-primary flex items-center gap-2'
              >
                <MdPersonAdd />
                Add User
              </button>
            </div>

            <div className='p-4'>
              <RenderHRMDataTable
                title='Tenant Users'
                data={usersData?.data || []}
                columns={userColumns}
                isLoading={isUsersLoading}
                refetch={refetchUsers}
                detailPath='/users/user_list'
                hide_columns={['id']}
                action='RD' // Read and Delete actions
                deleteFunc={id => {
                  console.log('RenderHRMDataTable deleteFunc called with:', id);
                  handleRemoveUser(id);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Update Tenant Modal */}
      {tenant && (
        <ModalUpdateTenant
          modal={isUpdateModalOpen}
          setModal={setIsUpdateModalOpen}
          tenantData={tenant}
          onSuccess={refetchTenant}
        />
      )}

      {/* Invite User by Email Modal */}
      <ModalInviteUserByEmail
        modal={isInviteModalOpen}
        setModal={setIsInviteModalOpen}
        refetch={refetchUsers}
      />
    </div>
  );
};

export default MyTenantPage;
