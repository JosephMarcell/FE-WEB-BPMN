'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { writeCurrency } from '@/lib/money';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import InsuranceTable from '@/components/apps/hrm/information_management/insurance/_components/insurance-table';
import ModalInsurance from '@/components/apps/hrm/information_management/insurance/_components/modal-insurance';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllInsurance } from '@/app/api/hooks/hrm/insurance/useGetAllInsurance';
import { InsuranceProperty } from '@/helpers/utils/hrm/insurance';

const ComponentsInsurance = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listCategory, isLoading, refetch } = useGetAllInsurance();
  const [insuranceData, setInsuranceData] = useState<InsuranceProperty[]>();

  useEffect(() => {
    if (listCategory !== undefined) {
      const newArr: InsuranceProperty[] = [];

      listCategory?.data.map((item: InsuranceProperty) => {
        if (item.asuransi_type === 'Percentage') {
          newArr.push({
            ...item,
            asuransi_amount: item.asuransi_amount + '%',
          });
        } else if (item.asuransi_type === 'Nominal') {
          newArr.push({
            ...item,
            asuransi_amount: handleWriteCurrency(
              Number(item.asuransi_amount || 0),
            ),
          });
        }
      });

      setInsuranceData(newArr);
    }
  }, [listCategory]);

  const handleWriteCurrency = (value: number) => writeCurrency(value);

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      {listCategory?.headers['can_create'] === 'true' && (
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => dispatch(setModalForm(true))}
        >
          Add New Insurance
        </button>
      )}
      <ModalInsurance
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <InsuranceTable
          data={insuranceData}
          permission={`
            ${listCategory?.headers.can_update === 'true' ? 'U' : ''}
            ${listCategory?.headers.can_delete === 'true' ? 'D' : ''}
          `}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInsurance;
