'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { writeCurrency } from '@/lib/money';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CharityTable from '@/components/apps/hrm/information_management/charity/_components/charity-table';
import ModalCharity from '@/components/apps/hrm/information_management/charity/_components/modal-charity';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllCharity } from '@/app/api/hooks/hrm/charity/useGetAllCharity';
import { CharityProperty } from '@/helpers/utils/hrm/charity';

const ComponentsCharity = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listCategory, isLoading, refetch } = useGetAllCharity();
  const [charityData, setCharityData] = useState<CharityProperty[]>();

  useEffect(() => {
    if (listCategory !== undefined) {
      const newArr: CharityProperty[] = [];

      listCategory.data.map((item: CharityProperty) => {
        if (item.amal_type === 'Percentage') {
          newArr.push({
            ...item,
            amal_amount: item.amal_amount + '%',
          });
        } else if (item.amal_type === 'Nominal') {
          newArr.push({
            ...item,
            amal_amount: handleWriteCurrency(Number(item.amal_amount || 0)),
          });
        }
      });

      setCharityData(newArr);
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
          Add New Charity
        </button>
      )}
      <ModalCharity
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <CharityTable
          data={charityData}
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

export default ComponentsCharity;
