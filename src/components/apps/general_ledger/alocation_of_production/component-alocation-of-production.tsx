'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AlocationOfProductionTable from '@/components/apps/general_ledger/alocation_of_production/_components/alocation-of-production-table';
import ModalAlocationofProduction from '@/components/apps/general_ledger/alocation_of_production/_components/modal-alocation-of-production';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAlocationOfProduction } from '@/app/api/hooks/general_ledger/alocation_of_production/useGetAllAlocationOfProduction';

const ComponentsAlocationOfProduction = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listAlocationOfProduction,
    isLoading,
    refetch,
  } = useGetAllAlocationOfProduction();
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
        Create New Alocation Of Production
      </button>
      <ModalAlocationofProduction
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <AlocationOfProductionTable
          data={listAlocationOfProduction}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsAlocationOfProduction;
