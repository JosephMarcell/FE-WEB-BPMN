import { Dialog, Tab, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';

import CommonJournal from '@/components/apps/general_ledger/journal_management/_components/common-journal';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateAssetDisposal } from '@/app/api/hooks/fixed_asset/asset_disposal/useCreateAssetDisposal';
import { useGetAssetDisposalByPkid } from '@/app/api/hooks/fixed_asset/asset_disposal/useGetAssetDisposalByPkid';
import { useUpdateAssetDisposal } from '@/app/api/hooks/fixed_asset/asset_disposal/useUpdateAssetDisposal';
import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { assetDisposalInitialState } from '@/helpers/utils/fixed_asset/asset_disposal';
import { journalInitialState } from '@/helpers/utils/general_ledger/journal';

interface IModalAssetDisposalProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
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
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string;
}
const ModalAssetDisposal = ({
  modal,
  modalEdit,
  setModal,
  refetch,
  setModalEdit,
}: IModalAssetDisposalProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();
  const { mutateAsync: createAssetDisposal } = useCreateAssetDisposal();
  const { mutateAsync: updateAssetDisposal } = useUpdateAssetDisposal();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(assetDisposalInitialState);
  const [formJournal, setFormJournal] = useState(journalInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [enabled, setEnabled] = useState(false);
  const [dataJournalDetail, setDataJournalDetail] = useState(
    [] as JournalDetail[],
  );

  const {
    data: assetDisposalDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetDisposalByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (assetDisposalDetail && modalEdit) {
      setForm(assetDisposalDetail);
    }
  }, [assetDisposalDetail, modalEdit]);

  const mandatoryValidation = () => {
    const temp = { ...form, ...formJournal };
    const requiredField = [] as string[];
    const excludeItemField = [
      'created_by',
      'created_date',
      'created_host',
      'updated_by',
      'updated_date',
      'updated_host',
      'is_deleted',
      'deleted_by',
      'deleted_date',
      'deleted_host',
      'status',
      'code',
      'ref',
      'amount',
      'approval_status',
      'post_status',
      'accounting_period_pkid',
      'numbering_pkid',
      'work_centre_pkid',
    ] as string[];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );
    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
        temp[field as keyof typeof temp] === '' ||
        temp[field as keyof typeof temp] === 0 ||
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
    value: string | number | Date | null,
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
    if (modal) {
      if (key === 'disposal_date') {
        setFormJournal({
          ...formJournal,
          ['post_date']: value ? new Date(value) : null,
          ['transaction_type_pkid']: 5,
        });
      } else {
        setFormJournal({ ...formJournal, [key]: value });
      }
    }
  };
  // const deleteAttributes = (obj: JournalProperty) => {
  //   const newObj = { ...obj };

  //   delete (newObj as { code?: string }).code;
  //   delete (newObj as { ref?: string }).ref;
  //   delete (newObj as { approval_status?: boolean }).approval_status;
  //   delete (newObj as { post_status?: boolean }).post_status;
  //   delete (newObj as { accounting_period_pkid?: number })
  //     .accounting_period_pkid;
  //   delete (newObj as { numbering_pkid?: number }).numbering_pkid;
  //   delete (newObj as { work_centre_pkid?: number }).work_centre_pkid;
  //   delete (newObj as { pkid?: string }).pkid;
  //   return newObj;
  // };
  const journalBalance = dataJournalDetail.reduce(
    (acc, curr) => acc + (curr.debit - curr.credit),
    0,
  );
  const totalAmount = dataJournalDetail.reduce(
    (acc, curr) => acc + +curr.debit,
    0,
  );
  useEffect(() => {
    setFormJournal(prevForm => ({
      ...prevForm,
      amount: totalAmount,
      JournalDetails: dataJournalDetail,
    }));
  }, [totalAmount, dataJournalDetail]);

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(assetDisposalInitialState)) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(assetDisposalInitialState);
      setFormJournal(journalInitialState);
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
            setForm(assetDisposalInitialState);
            setFormJournal(journalInitialState);
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
      if (journalBalance !== 0) {
        Swal.fire({
          title: 'Journal Balance is not 0',
          text: 'Please make sure your journal balance is 0',
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
              if (modalEdit) {
                const tempForm = { ...form };
                const formAfterDeletion = deleteBaseAttributes(tempForm);

                await updateAssetDisposal({
                  pkid: pkid,
                  data: formAfterDeletion,
                });
                setModalEdit(false);
              }
              if (modal) {
                await createAssetDisposal(form);

                setModal(false);
              }
              setForm(assetDisposalInitialState);
              setEmptyField([]);
              setFormJournal(journalInitialState);
              Swal.fire(
                'Saved!',
                'Your request has been saved.',
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
      setForm(assetDisposalInitialState);
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
          className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>New Disposal Asset</h5>
                <button
                  onClick={handleClose}
                  type='button'
                  className='text-white-dark hover:text-dark'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5'>
                <Tab.Group>
                  <Tab.List className='border-white-light mt-3 flex flex-wrap border-b dark:border-[#191e3a]'>
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        <button
                          type='button'
                          className={`${
                            selected
                              ? '!border-white-light text-primary  !border-b-white !outline-none dark:!border-[#191e3a] dark:!border-b-black '
                              : ''
                          } hover:text-primary -mb-[1px] block border border-transparent p-3.5 py-2 dark:hover:border-b-black`}
                        >
                          Request Information
                        </button>
                      )}
                    </Tab>
                    {modal && (
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <button
                            type='button'
                            className={`${
                              selected
                                ? '!border-white-light text-primary  !border-b-white !outline-none dark:!border-[#191e3a] dark:!border-b-black '
                                : ''
                            }-mb-[1px] hover:text-primary block border border-transparent p-3.5 py-2 dark:hover:border-b-black`}
                          >
                            Other Information
                          </button>
                        )}
                      </Tab>
                    )}
                  </Tab.List>
                  <Tab.Panels className='text-sm'>
                    <Tab.Panel>
                      <div className='active pt-5'>
                        <div className='space-y-5'>
                          <div>
                            <label htmlFor='title'>
                              Judul Disposal
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              id='title'
                              name='title'
                              type='text'
                              placeholder='Judul Pemberhentian aset'
                              className='form-input'
                              onChange={e =>
                                handleOnChange(String(e.target.value), 'title')
                              }
                              value={form.title || ''}
                              style={{
                                borderColor: emptyField.includes('title')
                                  ? 'red'
                                  : '',
                              }}
                            />
                          </div>
                          <div>
                            <label htmlFor='asset_pkid'>
                              Nama Aset
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                              id='asset_pkid'
                              name='asset_pkid'
                              placeholder='Pilih Aset'
                              className='basic-single'
                              options={listAsset?.map((item: OptionSelect) => ({
                                value: item.pkid,
                                label: item.name,
                              }))}
                              isSearchable={true}
                              isClearable={true}
                              maxMenuHeight={150}
                              menuPlacement='top'
                              styles={{
                                menu: provided => ({
                                  ...provided,
                                  zIndex: 9999, // Set a high z-index value
                                }),
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes('asset_pkid')
                                    ? 'red'
                                    : '',
                                }),
                              }}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || '',
                                  'asset_pkid',
                                )
                              }
                              value={
                                form.asset_pkid
                                  ? {
                                      value: form.asset_pkid ?? '',
                                      label:
                                        listAsset?.find(
                                          (item: OptionSelect) =>
                                            item.pkid === form.asset_pkid,
                                        )?.name ?? '',
                                    }
                                  : null
                              }
                            />
                          </div>
                          <div>
                            <label htmlFor='disposal_reason'>
                              Alasan Disposal
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              id='disposal_reason'
                              name='disposal_reason'
                              type='text'
                              placeholder='Alasan Disposal'
                              className='form-input'
                              onChange={e =>
                                handleOnChange(
                                  String(e.target.value),
                                  'disposal_reason',
                                )
                              }
                              value={form.disposal_reason || ''}
                              style={{
                                borderColor: emptyField.includes(
                                  'disposal_reason',
                                )
                                  ? 'red'
                                  : '',
                              }}
                            />
                          </div>
                          <div>
                            <label htmlFor='disposal_method'>
                              Metode Disposal
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              id='disposal_method'
                              name='disposal_method'
                              type='text'
                              placeholder='Alasan Disposal'
                              className='form-input'
                              onChange={e =>
                                handleOnChange(
                                  String(e.target.value),
                                  'disposal_method',
                                )
                              }
                              value={form.disposal_method || ''}
                              style={{
                                borderColor: emptyField.includes(
                                  'disposal_method',
                                )
                                  ? 'red'
                                  : '',
                              }}
                            />
                          </div>
                          <div>
                            <label htmlFor='disposal_date'>
                              Tanggal Disposal Aset{' '}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Flatpickr
                              id='disposal_date'
                              name='disposal_date'
                              placeholder='Pilih Tanggal'
                              options={{
                                dateFormat: 'Y-m-d',
                                position: isRtl ? 'auto right' : 'auto left',
                              }}
                              className='form-input'
                              onChange={date =>
                                handleOnChange(date[0], 'disposal_date')
                              }
                              value={form.disposal_date || ''}
                              style={{
                                borderColor: emptyField.includes(
                                  'disposal_date',
                                )
                                  ? 'red'
                                  : '',
                              }}
                            />
                          </div>

                          <div>
                            <label htmlFor='description'>
                              Deskripsi Disposal{' '}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                              id='description'
                              name='description'
                              rows={3}
                              className='form-textarea'
                              placeholder='Enter Address'
                              onChange={e =>
                                handleOnChange(
                                  String(e.target.value),
                                  'description',
                                )
                              }
                              value={form.description || ''}
                              required
                              style={{
                                borderColor: emptyField.includes('description')
                                  ? 'red'
                                  : '',
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className='pt-5'>
                        <CommonJournal
                          form={formJournal}
                          handleOnChange={handleOnChange}
                          dataJournalDetail={dataJournalDetail}
                          setDataJournalDetail={setDataJournalDetail}
                          emptyField={emptyField}
                        />
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
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

export default ModalAssetDisposal;
