'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import EndOfMonthTable from '@/components/apps/general_ledger/end_of_month/_components/end-of-month-table';
import ModalEndOfMonth from '@/components/apps/general_ledger/end_of_month/_components/modal-end-of-month';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllEndOfMonth } from '@/app/api/hooks/general_ledger/end_of_month/useGetAllEndOfMonth';

const ComponentsEndOfMonth = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listEndOfMonth, isLoading, refetch } = useGetAllEndOfMonth();
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        Create New End Of Month
      </button>
      <ModalEndOfMonth
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <EndOfMonthTable
          data={listEndOfMonth}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsEndOfMonth;
