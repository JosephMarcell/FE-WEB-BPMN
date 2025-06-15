'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';
import ModalInviteUser from '@/components/tenants/_components/modal-invite-user';

import {
  Tenant,
  useGetAllTenants,
} from '@/app/api/hooks/tenant/useGetAllTenants';
import { useGetTenantUsers } from '@/app/api/hooks/tenant/useGetTenantUsers';
import { useRemoveUserFromTenant } from '@/app/api/hooks/tenant/useRemoveUserFromTenant';

export default function TenantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const userRole = Cookies.get('userRole');
  const isSuperAdmin = userRole === 'SUPERADMIN';

  // State for invite user modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Get tenant details
  const { data: tenantsData } = useGetAllTenants();
  const tenant = tenantsData?.data?.find((t: Tenant) => t.id === id);

  // Get users in this tenant with the updated hook
  const { data: usersData, isLoading, refetch } = useGetTenantUsers(id);

  // Remove user from tenant mutation
  const { mutateAsync: removeUserFromTenant } = useRemoveUserFromTenant();

  // Handle removing a user from tenant
  const handleRemoveUser = async (userId: string | number) => {
    // Convert userId to string if it's a number
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();

    try {
      Swal.fire({
        title: 'Remove User',
        text: 'Are you sure you want to remove this user from the tenant?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel',
      }).then(async result => {
        if (result.isConfirmed) {
          await removeUserFromTenant({ tenantId: id, userId: userIdStr });

          Swal.fire({
            title: 'Success',
            text: 'User has been removed from the tenant',
            icon: 'success',
          }).then(() => {
            // Refresh the user list
            refetch();
          });
        }
      });
    } catch (error: any) {
      console.error('Error removing user:', error);

      let errorMessage = 'Failed to remove user from tenant';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });
    }
  };

  // Handle when tenant not found
  if (!tenant && !isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='dark:bg-navy-700 rounded-lg bg-white p-8 shadow-md'>
          <h2 className='mb-4 text-center text-2xl font-bold'>
            Tenant Not Found
          </h2>
          <p className='mb-6 text-center text-gray-600 dark:text-gray-400'>
            The tenant you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <div className='flex justify-center'>
            <button
              onClick={() => router.push('/tenants')}
              className='btn btn-primary'
            >
              Go Back to Tenants
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

  return (
    <div className='space-y-6'>
      {/* Tenant Info Panel */}
      <div className='panel'>
        <div className='mb-5 flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
          <div>
            <h2 className='text-xl font-bold'>{tenant?.name}</h2>
            <p className='text-gray-500'>{tenant?.description}</p>
          </div>
          <button
            onClick={() => router.push('/tenants')}
            className='btn btn-outline-primary'
          >
            Back to Tenants
          </button>
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
            <span className='text-sm text-gray-500'>Subscription Start</span>
            <span className='font-medium'>
              {tenant?.subscription_start_date
                ? new Date(tenant.subscription_start_date).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm text-gray-500'>Subscription End</span>
            <span className='font-medium'>
              {tenant?.subscription_end_date
                ? new Date(tenant.subscription_end_date).toLocaleDateString()
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

      {/* Users Table with Invite Button (visible only to SUPERADMIN) */}
      <div className='panel p-0'>
        <div className='flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700'>
          <div>
            <h3 className='text-lg font-bold'>Users in {tenant?.name}</h3>
            <p className='text-sm text-gray-500'>
              Manage users associated with this tenant
            </p>
          </div>

          {/* Invite User Button - only visible to SUPERADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className='btn btn-primary flex items-center gap-2'
            >
              <MdPersonAdd />
              Invite User
            </button>
          )}
        </div>

        <div className='p-4'>
          <RenderHRMDataTable
            title='Tenant Users'
            data={usersData?.data || []}
            columns={userColumns}
            isLoading={isLoading}
            refetch={refetch}
            detailPath='/users/user_list'
            hide_columns={['id']}
            action={isSuperAdmin ? 'RD' : 'R'} // Only superadmin can delete users
            deleteFunc={isSuperAdmin ? handleRemoveUser : undefined} // Pass the delete function only if superadmin
          />
        </div>
      </div>

      {/* Invite User Modal - only rendered for SUPERADMIN */}
      {isSuperAdmin && (
        <ModalInviteUser
          modal={isInviteModalOpen}
          setModal={setIsInviteModalOpen}
          tenantId={id}
          refetch={refetch}
        />
      )}
    </div>
  );
}
