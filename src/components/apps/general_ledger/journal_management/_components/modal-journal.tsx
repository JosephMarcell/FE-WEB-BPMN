import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select, { components, GroupBase, OptionProps } from 'react-select';
import Swal from 'sweetalert2';

import 'tippy.js/dist/tippy.css';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCoa } from '@/app/api/hooks/general_ledger/coa/useGetAllCoa';
import { useCreateJournal } from '@/app/api/hooks/general_ledger/journal/useCreateJournal';
import { useGetJournalByPkid } from '@/app/api/hooks/general_ledger/journal/useGetJournalByPkid';
import { useUpdateJournal } from '@/app/api/hooks/general_ledger/journal/useUpdateJournal';
import { useGetAllTransactionType } from '@/app/api/hooks/general_ledger/transaction_type/useGetAllTransactionType';
import {
  journalInitialState,
  JournalProperty,
} from '@/helpers/utils/general_ledger/journal';

interface IModalInputCashFlowProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  number: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
interface JournalDetail {
  credit: number;
  credit_curr: number;
  debit: number;
  debit_curr: number;
  coa_pkid: number;
  name: string;
  number: string;
}

const ModalJournal = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalInputCashFlowProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { mutateAsync: createJournal } = useCreateJournal();
  const { mutateAsync: updateJournal } = useUpdateJournal();
  const { data: listTransactionType } = useGetAllTransactionType();
  const { data: listCoa } = useGetAllCoa();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(journalInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [dataJournalDetail, setDataJournalDetail] = useState(
    [] as JournalDetail[],
  );

  const {
    data: journalDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetJournalByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (journalDetail && modalEdit) {
      setForm(journalDetail);
      setDataJournalDetail(journalDetail.JournalDetails);
    }
  }, [journalDetail, modalEdit]);

  const handleAddJournalDetail = (
    coa_pkid: number,
    name: string,
    number: string,
  ) => {
    const isExist = dataJournalDetail.some(data => data.coa_pkid === coa_pkid);
    if (isExist) {
      Swal.fire({
        title: 'COA Already Inserted',
        text: 'Please select another coa',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }
    const tempDataJournalDetail = [...dataJournalDetail];
    const data = {
      credit: 0,
      credit_curr: 0,
      debit: 0,
      debit_curr: 0,
      coa_pkid: coa_pkid,
      name: name,
      number: number,
    };
    tempDataJournalDetail.push(data);
    setDataJournalDetail(tempDataJournalDetail);
  };
  const handleDeleteJournalDetail = (coa_pkid: number) => {
    const tempDataJournalDetail = [...dataJournalDetail];
    const newDataJournalDetail = tempDataJournalDetail.filter(
      data => data.coa_pkid !== coa_pkid,
    );
    setDataJournalDetail(newDataJournalDetail);
  };
  const handleOnChangeJournalDetail = (
    value: string | number | null | undefined,
    key: string | number,
    coa_pkid: number,
  ) => {
    const tempDataJournalDetail = [...dataJournalDetail];
    const newDataJournalDetail = tempDataJournalDetail.map(data => {
      if (data.coa_pkid === coa_pkid) {
        return { ...data, [key]: value, [`${key}_curr`]: value };
      }
      return data;
    });
    setDataJournalDetail(newDataJournalDetail);
  };

  function CustomOption<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
  >(props: OptionProps<Option, IsMulti, Group>) {
    const data = props.data as {
      value: number;
      label: string;
      kode: string;
    };
    return (
      <components.Option {...props}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>{props.children}</div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={e => {
              e.stopPropagation();
              handleAddJournalDetail(data?.value, data?.label, data?.kode);
            }}
          >
            Add
          </button>
        </div>
      </components.Option>
    );
  }

  const customComponents = {
    Option: CustomOption,
  };
  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'code',
      'ref',
      'approval_status',
      'post_status',
      'accounting_period_pkid',
      'numbering_pkid',
      'work_centre_pkid',
      'amount',
    ] as string[];
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
    value: string | number | null | Date | undefined,
    key: string,
  ) => {
    if (key.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(journalInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(journalInitialState);
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
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              setModal(false);
            }
            setForm(journalInitialState);
            setEmptyField([]);
            setDataJournalDetail([]);
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };
  const journalBalance = dataJournalDetail.reduce(
    (acc, curr) => acc + (curr.debit - curr.credit),
    0,
  );
  const totalAmount = dataJournalDetail.reduce(
    (acc, curr) => acc + +curr.debit,
    0,
  );

  const deleteAttributes = (obj: JournalProperty) => {
    const newObj = { ...obj };

    delete (newObj as { code?: string }).code;
    delete (newObj as { ref?: string }).ref;
    delete (newObj as { approval_status?: boolean }).approval_status;
    delete (newObj as { post_status?: boolean }).post_status;
    delete (newObj as { accounting_period_pkid?: number })
      .accounting_period_pkid;
    delete (newObj as { numbering_pkid?: number }).numbering_pkid;
    delete (newObj as { work_centre_pkid?: number }).work_centre_pkid;
    delete (newObj as { pkid?: string }).pkid;
    return newObj;
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
      if (journalBalance !== 0) {
        Swal.fire({
          title: 'Journal Balance is not 0',
          text: 'Please make sure your journal balance is 0',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      } else {
        const payload = deleteAttributes(form);
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
              if (modalEdit) {
                const tempForm = {
                  ...form,
                  amount: totalAmount,
                  JournalDetails: dataJournalDetail,
                };
                await updateJournal({
                  pkid: pkid,
                  data: tempForm,
                });
                setModalEdit(false);
              }
              if (modal) {
                await createJournal(payload);
                setModal(false);
              }
              setForm(journalInitialState);
              setEmptyField([]);
              setDataJournalDetail([]);
              Swal.fire(
                'Saved!',
                'Your category has been saved.',
                'success',
              ).then(() => {
                refetch();
              });
            } catch (error) {
              Swal.fire('Error!', 'Something went wrong', 'error');
            }
          }
        });
      }
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(journalInitialState);
      setDataJournalDetail([]);
    }
    if (modal) {
      setModal(false);
    }
  };

  return (
    <Transition appear show={modal || modalEdit} as={Fragment}>
      <Dialog
        as='div'
        open={modal || modalEdit}
        onClose={() => {
          if (modalEdit) {
            setModalEdit(true);
          }
          if (modal) {
            setModal(true);
          }
        }}
      >
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
                <h5 className='text-lg font-bold'>
                  {modal ? 'New' : 'Edit'} New Journal
                </h5>
                <button
                  onClick={handleClose}
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
                      <label htmlFor='post_date'>
                        Per Tanggal <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Flatpickr
                        id='post_date'
                        name='post_date'
                        placeholder='Pilih Tanggal'
                        options={{
                          dateFormat: 'Y-m-d',
                          position: isRtl ? 'auto right' : 'auto left',
                        }}
                        className='form-input'
                        onChange={date => handleOnChange(date[0], 'post_date')}
                        value={form.post_date || ''}
                        style={{
                          borderColor: emptyField.includes('post_date')
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='transaction_type_pkid'>
                        Tipe Transaksi <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='transaction_type_pkid'
                        placeholder='Pilih Kategori Aset'
                        name='transaction_type_pkid'
                        className='basic-single'
                        options={listTransactionType?.map(
                          (item: OptionSelect) => ({
                            value: item.pkid,
                            label: item.name,
                          }),
                        )}
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(
                            selectedOption?.value || null,
                            'transaction_type_pkid',
                          )
                        }
                        isSearchable={true}
                        isClearable={true}
                        value={
                          form.transaction_type_pkid
                            ? {
                                value: form.transaction_type_pkid ?? '',
                                label:
                                  listTransactionType?.find(
                                    (item: OptionSelect) =>
                                      item.pkid === form.transaction_type_pkid,
                                  )?.name ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes(
                              'transaction_type_pkid',
                            )
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
                  <div>
                    <label htmlFor='notes'>
                      Keterangan <span style={{ color: 'red' }}>*</span>
                    </label>
                    <textarea
                      id='notes'
                      name='notes'
                      rows={3}
                      className='form-textarea'
                      placeholder='Enter notes'
                      onChange={e =>
                        handleOnChange(String(e.target.value), 'notes')
                      }
                      value={form.notes || ''}
                      required
                      style={{
                        borderColor: emptyField.includes('notes') ? 'red' : '',
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor='find_coa'>
                      Cari Akun Perkiraan{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      id='find_coa'
                      placeholder='Pilih Kategori Aset'
                      name='find_coa'
                      className='basic-single'
                      components={customComponents}
                      options={listCoa?.map((item: OptionSelect) => ({
                        value: item.pkid,
                        label: item.name,
                        kode: item.number,
                      }))}
                      isSearchable={true}
                      isClearable={true}
                      menuPortalTarget={document.body}
                      styles={{
                        control: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                        menuPortal: provided => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                  <div className='table-responsive mb-5'>
                    <table>
                      <thead>
                        <tr>
                          <th>Kode</th>
                          <th>Nama</th>
                          <th className='text-center'>Debit</th>
                          <th className='text-center'>Credit</th>
                          <th className='text-center'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading || !dataJournalDetail ? (
                          <div className='flex items-center justify-center'>
                            Loading
                          </div>
                        ) : (
                          dataJournalDetail.map(
                            (data: JournalDetail, index: number) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <div className='whitespace-nowrap'>
                                      {data.number}
                                    </div>
                                  </td>
                                  <td>
                                    <div className='whitespace-nowrap'>
                                      {data.name}
                                    </div>
                                  </td>
                                  <td className='text-right'>
                                    <input
                                      type='text'
                                      className='form-input'
                                      placeholder='0'
                                      onChange={e =>
                                        handleOnChangeJournalDetail(
                                          e.target.value,
                                          'debit',
                                          data.coa_pkid,
                                        )
                                      }
                                      value={data.debit}
                                    />
                                  </td>
                                  <td className='text-right'>
                                    <input
                                      type='text'
                                      className='form-input'
                                      onChange={e =>
                                        handleOnChangeJournalDetail(
                                          e.target.value,
                                          'credit',
                                          data.coa_pkid,
                                        )
                                      }
                                      placeholder='0'
                                      value={data.credit}
                                    />
                                  </td>

                                  <td className='text-center'>
                                    <button
                                      className='btn btn-danger btn-sm'
                                      onClick={() =>
                                        handleDeleteJournalDetail(data.coa_pkid)
                                      }
                                    >
                                      delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            },
                          )
                        )}
                        <tr>
                          <td colSpan={2} className='text-center'>
                            <strong>Total</strong>
                          </td>
                          <td className='text-right'>
                            {dataJournalDetail.reduce(
                              (acc, curr) => acc + +curr.debit,
                              0,
                            )}
                          </td>
                          <td className='text-right'>
                            {dataJournalDetail.reduce(
                              (acc, curr) => acc + +curr.credit,
                              0,
                            )}
                          </td>
                          <td className='text-right'>
                            {Math.abs(
                              dataJournalDetail.reduce(
                                (acc, curr) => acc + +curr.credit,
                                0,
                              ) -
                                dataJournalDetail.reduce(
                                  (acc, curr) => acc + +curr.debit,
                                  0,
                                ),
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default ModalJournal;
