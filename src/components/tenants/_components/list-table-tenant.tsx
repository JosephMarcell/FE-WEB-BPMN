'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { setPkid } from '@/store/themeConfigSlice';

import { useDeleteTenant } from '@/app/api/hooks/tenant/useDeleteTenant'; // Import the delete hook
import {
  Tenant,
  useGetAllTenants,
} from '@/app/api/hooks/tenant/useGetAllTenants';

const { t } = getTranslation();

// Mendefinisikan tipe yang kompatibel dengan MyData dengan menambahkan indeks signature
interface TenantTableData extends Tenant {
  [key: string]: unknown;
}

interface TenantTableProps {
  setModalEdit: (value: boolean) => void;
  refresh?: boolean;
}

const TenantTable = ({ setModalEdit, refresh }: TenantTableProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetAllTenants();
  const { mutateAsync: deleteTenantMutation } = useDeleteTenant(); // Use the delete hook

  React.useEffect(() => {
    if (refresh !== undefined) {
      refetch();
    }
  }, [refresh, refetch]);

  // Implement delete tenant functionality
  const handleDeleteTenant = async (id: string | number) => {
    // Convert id to string if it's not already
    const tenantId = typeof id === 'string' ? id : String(id);

    console.log('Delete requested for tenant ID:', tenantId);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          console.log('Confirmed delete for tenant ID:', tenantId);
          await deleteTenantMutation(tenantId);
          console.log('Delete successful');
          Swal.fire('Deleted!', 'Tenant has been deleted.', 'success');
          refetch(); // Refresh the data after deletion
        } catch (error) {
          console.error('Error deleting tenant:', error);

          // Extract error message from the response if available
          let errorMessage = 'Failed to delete tenant';
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
              response?: { data?: { error?: string; message?: string } };
            };
            errorMessage =
              axiosError.response?.data?.error ||
              axiosError.response?.data?.message ||
              'An error occurred while deleting the tenant';
          }

          Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  // Handle edit tenant
  const handleEditTenant = (id: string | number) => {
    // Convert id to appropriate type for Redux store
    dispatch(setPkid(id as any));

    // This line calls the setModalEdit from props, not the Redux action with the same name
    setModalEdit(true);
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cols = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'name', title: 'Tenant Name' },
    { accessor: 'contact_email', title: 'Email' },
    { accessor: 'contact_phone', title: 'Phone' },
    { accessor: 'subscription_plan', title: 'Plan' },
    {
      accessor: 'subscription_end_date',
      title: 'Expiry Date',
      render: (row: TenantTableData) =>
        formatDate(row.subscription_end_date as string),
    },
    {
      accessor: 'is_active',
      title: 'Status',
      render: (row: TenantTableData) => (
        <span className={`badge ${row.is_active ? 'bg-success' : 'bg-danger'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { accessor: 'action', title: t('action') },
  ];

  const handleRowClick = (id: string) => {
    router.push(`/tenants/${id}`);
  };

  // Konversi data.data (Tenant[]) ke TenantTableData[]
  const tableData = React.useMemo(() => {
    return (data?.data || []) as TenantTableData[];
  }, [data?.data]);

  return (
    <RenderHRMDataTable
      title='Tenant Management'
      data={tableData}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDeleteTenant}
      detailPath='/tenants'
      action='RUD' // Read, Update, Delete
      onEdit={handleEditTenant}
    />
  );
};

export default TenantTable;
