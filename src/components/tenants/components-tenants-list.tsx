'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';

import { IRootState } from '@/store';

import {
  Tenant,
  useGetAllTenants,
} from '@/app/api/hooks/tenant/useGetAllTenants';

import TenantTable from './_components/list-table-tenant';
import ModalTenant from './_components/modal-tenant';

const { t } = getTranslation();

const ComponentsTenantsList = () => {
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editTenantData, setEditTenantData] = useState<Tenant | null>(null);
  const { data: tenantData } = useGetAllTenants();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const refetch = () => {
    setRefresh(!refresh);
  };

  // When edit mode is activated via Redux store
  useEffect(() => {
    if (modalEdit && pkid && tenantData) {
      // Convert pkid to string if necessary for comparison with tenant.id
      const stringPkid = typeof pkid === 'number' ? String(pkid) : pkid;

      // Find the tenant by id/pkid
      const tenantToEdit = tenantData.data.find(
        tenant => tenant.id === stringPkid,
      );
      if (tenantToEdit) {
        setEditTenantData(tenantToEdit);
      }
    }
  }, [modalEdit, pkid, tenantData]);

  useEffect(() => {
    if (!modalEdit) {
      setEditTenantData(null);
    }
  }, [modalEdit]);

  return (
    <div className='space-y-6'>
      <div className='panel'>
        <div className='border-b-stable-color-50 mb-5 flex flex-wrap justify-between gap-4 border-b border-b-2 p-4 dark:border-[#1b2e4b]'>
          <div className='flex flex-col'>
            <h5 className='dark:text-white-light text-lg font-semibold'>
              Tenant Management
            </h5>
            <p className='text-white-dark text-sm font-medium'>
              Manage all tenants in the LecSens platform
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              className='btn btn-primary flex gap-2'
              onClick={() => setModal(true)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='12' y1='5' x2='12' y2='19'></line>
                <line x1='5' y1='12' x2='19' y2='12'></line>
              </svg>
              Add New Tenant
            </button>
          </div>
        </div>
        <div className=''>
          <TenantTable setModalEdit={setModalEdit} refresh={refresh} />
        </div>
      </div>

      {/* Create Tenant Modal */}
      <ModalTenant modal={modal} setModal={setModal} refetch={refetch} />

      {/* Edit Tenant Modal */}
      <ModalTenant
        modal={modalEdit}
        setModal={setModalEdit}
        refetch={refetch}
        isEdit={true}
        editData={editTenantData}
      />
    </div>
  );
};

export default ComponentsTenantsList;
