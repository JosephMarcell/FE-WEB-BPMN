'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ActionComponent from '@/components/apps/accounting_report/hpp/_components/action-component';
import ModalInputHpp from '@/components/apps/accounting_report/hpp/_components/modal-input-hpp';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

const ComponentsHpp = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

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
        Show Hpp Data
      </button>
      <ModalInputHpp
        modal={modalForm}
        setModal={handleSetModal}
        // refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <ActionComponent />
      </div>
    </div>
  );
};

export default ComponentsHpp;
