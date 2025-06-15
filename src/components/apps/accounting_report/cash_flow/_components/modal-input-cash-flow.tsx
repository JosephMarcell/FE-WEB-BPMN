import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { setCashFlowData } from '@/store/general_ledger/cash_flow';

import { useGetCashFlowReport } from '@/app/api/hooks/general_ledger/accounting_report/useGetCashFlowReport';
import {
  inputCashFlowInitialState,
  listMonths,
  listYears,
} from '@/helpers/utils/general_ledger/cashFlowReport';

interface IModalInputCashFlowProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch?: () => void;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
const ModalInputCashFlow = ({ modal, setModal }: IModalInputCashFlowProps) => {
  const { mutateAsync: getCashFlow } = useGetCashFlowReport();
  const [form, setForm] = useState(inputCashFlowInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const dispatch = useDispatch();
  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === undefined
      ) {
        requiredField.push(field);
      }
    });
    if (requiredField.length > 0) {
      setEmptyField(requiredField);
      return false;
    }
    return true;
  };
  const handleOnChange = (
    value: string | number | null | undefined,
    key: string | number,
  ) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(inputCashFlowInitialState)) {
      setModal(false);
      setForm(inputCashFlowInitialState);
      setEmptyField([]);
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your data will not be saved!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Discard it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            setModal(false);
            setForm(inputCashFlowInitialState);
            setEmptyField([]);
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Save it!',
        cancelButtonText: 'No, cancel!',
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            const response = await getCashFlow(form);
            setModal(false);
            setForm(inputCashFlowInitialState);
            setEmptyField([]);
            response.periods = form;
            dispatch(setCashFlowData(response));
            Swal.fire('Saved!', 'Your category has been saved.', 'success');
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(true)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0' />
        </Transition.Child>
        <div
          id='slideIn_down_modal'
          className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>Pilih Periode Laporan</h5>
                <button
                  onClick={() => setModal(false)}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5'>
                <div className='space-y-5'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='start_month'>
                        Bulan Awal<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='start_month'
                        placeholder='Pilih Tipe Aset'
                        name='start_month'
                        className='basic-single'
                        options={listMonths}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value ?? null,
                            'start_month',
                          )
                        }
                        value={
                          form.start_month
                            ? {
                                value: form.start_month ?? '',
                                label: form.start_month ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('start_month')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='start_year'>
                        Tahun Awal<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='start_year'
                        placeholder='Pilih Tipe Aset'
                        name='start_year'
                        className='basic-single'
                        options={listYears}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value ?? null,
                            'start_year',
                          )
                        }
                        value={
                          form.start_year
                            ? {
                                value: form.start_year ?? '',
                                label: form.start_year ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('start_year')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <label htmlFor='end_month'>
                        Bulan Akhir<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='end_month'
                        placeholder='Pilih Tipe Aset'
                        name='end_month'
                        className='basic-single'
                        options={listMonths}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value ?? null,
                            'end_month',
                          )
                        }
                        value={
                          form.end_month
                            ? {
                                value: form.end_month ?? '',
                                label: form.end_month ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('end_month')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='end_year'>
                        Tahun Akhir<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='end_year'
                        placeholder='Pilih Tipe Aset'
                        name='end_year'
                        className='basic-single'
                        options={listYears}
                        isSearchable={true}
                        isClearable={true}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value ?? null,
                            'end_year',
                          )
                        }
                        value={
                          form.end_year
                            ? {
                                value: form.end_year ?? '',
                                label: form.end_year ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('end_year')
                              ? 'red'
                              : '',
                            zIndex: 9999,
                          }),
                          menuPortal: provided => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                  <button
                    onClick={handleCancel}
                    type='button'
                    className='btn btn-outline-danger'
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='button'
                    className='btn btn-primary ltr:ml-4 rtl:mr-4'
                  >
                    Save
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalInputCashFlow;
