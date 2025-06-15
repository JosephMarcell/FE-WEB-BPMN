'use client';

import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ActionComponent from '@/components/apps/accounting_report/balance_sheet/_components/action-component';
import ModalInputBalanceSheet from '@/components/apps/accounting_report/balance_sheet/_components/modal-input-balance-sheet';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

const ComponentsBalanceSheet = () => {
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
        Show Balance Sheet Data
      </button>
      <ModalInputBalanceSheet
        modal={modalForm}
        setModal={handleSetModal}
        // refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <ActionComponent />
      </div>
    </div>
  );
};

export default ComponentsBalanceSheet;
