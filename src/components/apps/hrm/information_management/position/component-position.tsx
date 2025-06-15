'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { writeCurrency } from '@/lib/money';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalPosition from '@/components/apps/hrm/information_management/position/_components/modal-position';
import PositionTable from '@/components/apps/hrm/information_management/position/_components/position-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllPosition } from '@/app/api/hooks/hrm/position/useGetAllPosition';

interface MyData {
  [key: string]: unknown;
}

const ComponentsPosition = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listCategory, isLoading, refetch } = useGetAllPosition();
  const [positionData, setPositionData] = useState<MyData[]>();

  useEffect(() => {
    if (listCategory !== undefined) {
      const newArr: MyData[] = [];

      listCategory?.data.map((item: MyData) => {
        newArr.push({
          ...item,
          tunjangan_tetap: handleWriteCurrency(
            Number(item.tunjangan_tetap || 0),
          ),
          blue_cost_ph: item.blue_cost_ph
            ? handleWriteCurrency(Number(item.blue_cost_ph || 0))
            : '-',
        });
      });

      setPositionData(newArr);
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
          Add New Position
        </button>
      )}
      <ModalPosition
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PositionTable
          data={positionData}
          permission={`
            R
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

export default ComponentsPosition;
