'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CoaTable from '@/components/apps/general_ledger/coa/_components/coa-table';
import ModalCoa from '@/components/apps/general_ledger/coa/_components/modal-coa';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetAllCoa } from '@/app/api/hooks/general_ledger/coa/useGetAllCoa';

const ComponentsCoa = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const { data: listCoa, isLoading, refetch } = useGetAllCoa();
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        Create New COA
      </button>
      <ModalCoa modal={modalForm} setModal={handleSetModal} refetch={refetch} />
      <div className='relative flex h-full flex-col gap-5'>
        <CoaTable data={listCoa} isLoading={isLoading} refetch={refetch} />
      </div>
    </div>
  );
};

export default ComponentsCoa;
