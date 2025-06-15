import { Dialog, Tab, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllAccountType } from '@/app/api/hooks/general_ledger/account_type/useGetAllAccountType';
import { useCreateCoa } from '@/app/api/hooks/general_ledger/coa/useCreateCoa';
import { useGetCoaByAccountType } from '@/app/api/hooks/general_ledger/coa/useGetCoaByAccountType';
import { useCreateGoaGroup } from '@/app/api/hooks/general_ledger/coa_group/useCreateGoaGroup';
import { useGetCoaGroupByAccountType } from '@/app/api/hooks/general_ledger/coa_group/useGetCoaGroupByAccountType';
import {
  coaInitialState,
  CoaProperty,
} from '@/helpers/utils/general_ledger/coa';
import { CoaGroupProperty } from '@/helpers/utils/general_ledger/coaGroup';
interface IModalCoaProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string;
  number?: string;
  code?: string;
  coa_group_pkid?: number;
}
interface SelectedOption {
  value: string | number | boolean | Date | null | undefined;
  label: string;
}

const ModalCoa = ({ modal, setModal, refetch }: IModalCoaProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAccountType } = useGetAllAccountType();
  const { mutateAsync: listCoaByAccountType } = useGetCoaByAccountType();
  const { mutateAsync: createCoa } = useCreateCoa();
  const { mutateAsync: createCoaGroup } = useCreateGoaGroup();
  const { mutateAsync: listCoaGroupByAccountType } =
    useGetCoaGroupByAccountType();

  const [form, setForm] = useState(coaInitialState);
  const [pengkodeanOtomatis, setPengkodeanOtomatis] = useState(false);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [useSubAkun, setUseSubAkun] = useState(false);
  const [listCoaDataByAccountType, setListCoaDataByAccountType] = useState<
    OptionSelect[]
  >([]);
  const [listCoaGroupDataByAccountType, setListCoaGroupDataByAccountType] =
    useState<OptionSelect[]>([]);
  const [listCoaDataByCoaGroup, setListCoaDataByCoaGroup] = useState<
    OptionSelect[]
  >([]);
  const [selectedCoaGroup, setSelectedCoaGroup] = useState<OptionSelect>();
  const [selectedCoa, setSelectedCoa] = useState<OptionSelect>();

  useEffect(() => {
    if (form.account_type_pkid && form.coa_group_pkid && pengkodeanOtomatis) {
      if (useSubAkun && selectedCoa) {
        const code = selectedCoa?.number;
        const codeFactory = code?.toString() + '01';

        setForm(prevForm => ({
          ...prevForm,
          number: codeFactory,
        }));
      } else {
        if (listCoaDataByCoaGroup.length > 0) {
          const findLastCoa =
            listCoaDataByCoaGroup[listCoaDataByCoaGroup.length - 1];
          const findLastCoaNumber = findLastCoa?.number ?? 0;
          const codeFactory = (Number(findLastCoaNumber) + 1)
            .toString()
            .padStart(2, '0');

          setForm(prevForm => ({
            ...prevForm,
            number: codeFactory,
          }));
        } else {
          const code = selectedCoaGroup?.code;
          const codeFactory = code?.toString() + '01';

          setForm(prevForm => ({
            ...prevForm,
            number: codeFactory,
          }));
        }
      }
    }
  }, [
    listCoaDataByAccountType,
    listCoaDataByCoaGroup,
    form.account_type_pkid,
    form.coa_group_pkid,
    selectedCoa,
    selectedCoaGroup,
    useSubAkun,
    pengkodeanOtomatis,
  ]);
  const deleteAttributes = (obj: CoaProperty) => {
    const newObj = { ...obj };

    delete (newObj as { sub_account?: number }).sub_account;

    return newObj;
  };
  const mandatoryValidation = () => {
    const temp = { ...form };
    const requiredField = [] as string[];
    const excludeItemField = [
      'coa_group_pkid',
      'work_centre_pkid',
      'entity',
      'sub_account',
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

  useEffect(() => {
    if (form.account_type_pkid) {
      const fetchlistCoaDataByAccountType = async () => {
        const coaResponse = await listCoaByAccountType(
          form.account_type_pkid ?? 0,
        );
        const coaGroupResponse = await listCoaGroupByAccountType(
          form.account_type_pkid ?? 0,
        );
        setListCoaDataByAccountType(coaResponse.data);
        setListCoaGroupDataByAccountType(coaGroupResponse.data);
      };
      fetchlistCoaDataByAccountType();
    }
  }, [form.account_type_pkid, listCoaByAccountType, listCoaGroupByAccountType]);

  useEffect(() => {
    if (form.account_type_pkid && form.coa_group_pkid) {
      const listCoa = listCoaDataByAccountType.filter(
        (item: OptionSelect) => item?.coa_group_pkid === form.coa_group_pkid,
      );
      const selectedCoaGroup = listCoaGroupDataByAccountType.find(
        item => item.pkid === form.coa_group_pkid,
      );
      setListCoaDataByCoaGroup(listCoa);
      setSelectedCoaGroup(selectedCoaGroup);
    }
  }, [
    form.coa_group_pkid,
    form.account_type_pkid,
    listCoaDataByAccountType,
    listCoaGroupDataByAccountType,
  ]);

  useEffect(() => {
    if (useSubAkun) {
      const selectedCoa = listCoaDataByCoaGroup.find(
        item => item.pkid === form.sub_account,
      );
      setSelectedCoa(selectedCoa);
    }
  }, [useSubAkun, form.sub_account, listCoaDataByCoaGroup]);

  useEffect(() => {
    if (useSubAkun) {
      setForm(prevForm => ({ ...prevForm, sub_account: null }));
    }
  }, [useSubAkun]);

  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    if (name.includes('tanggal') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }

    setForm({ ...form, [name]: value });
  };

  const handleCancel = () => {
    if (JSON.stringify(form) === JSON.stringify(coaInitialState)) {
      setModal(false);
      setForm(coaInitialState);
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
            setForm(coaInitialState);
            setEmptyField([]);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleSubmit = async () => {
    const isMandatoryEmpty = mandatoryValidation();

    if (!isMandatoryEmpty) {
      await Swal.fire({
        title: 'Some Field is Empty',
        text: 'Please fill all mandatory field',
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
            if (!form.coa_group_pkid) {
              const formCoaGroup: CoaGroupProperty = {
                name: form.name,
                calc: '0',
                code: form.number,
                description: form.name,
                account_type_pkid: form.account_type_pkid,
              };
              await createCoaGroup(formCoaGroup);
            } else {
              await createCoa(payload);
            }
            setModal(false);
            setForm(coaInitialState);
            setEmptyField([]);
            setListCoaGroupDataByAccountType([]);
            Swal.fire('Saved!', 'Your asset has been saved.', 'success').then(
              () => {
                refetch();
              },
            );
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
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
          className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'
        >
          <div className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
              <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                <h5 className='text-lg font-bold'>
                  Create New Chart Of Account
                </h5>
                <button
                  onClick={() => setModal(false)}
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
                          Information of Chart of Account
                        </button>
                      )}
                    </Tab>
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
                          Balance Information
                        </button>
                      )}
                    </Tab>
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
                          Other information
                        </button>
                      )}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className='text-sm'>
                    <Tab.Panel>
                      <div className='active pt-5'>
                        <div className='space-y-5'>
                          <div>
                            <label htmlFor='account_type_pkid'>
                              Tipe Akun <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                              id='account_type_pkid'
                              placeholder='Pilih Kategori Aset'
                              name='account_type_pkid'
                              className='basic-single'
                              options={listAccountType?.map(
                                (item: OptionSelect) => ({
                                  value: item.pkid,
                                  label: item.name,
                                }),
                              )}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || null,
                                  'account_type_pkid',
                                )
                              }
                              isSearchable={true}
                              isClearable={true}
                              value={
                                form.account_type_pkid
                                  ? {
                                      value: form.account_type_pkid ?? '',
                                      label:
                                        listAccountType?.find(
                                          (item: OptionSelect) =>
                                            item.pkid ===
                                            form.account_type_pkid,
                                        )?.name ?? '',
                                    }
                                  : null
                              }
                              menuPortalTarget={document.body}
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes(
                                    'account_type_pkid',
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
                          <div>
                            <label htmlFor='account_type_pkid'>
                              Kelompok Akun{' '}
                              {/* <span style={{ color: 'red' }}>*</span> */}
                            </label>
                            <Select
                              id='coa_group_pkid'
                              placeholder='Pilih Kategori Aset'
                              name='coa_group_pkid'
                              className='basic-single'
                              options={listCoaGroupDataByAccountType?.map(
                                (item: OptionSelect) => ({
                                  value: item.pkid as number,
                                  label: item.name.toString() + item.code,
                                }),
                              )}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || null,
                                  'coa_group_pkid',
                                )
                              }
                              isSearchable={true}
                              isClearable={true}
                              value={
                                form.coa_group_pkid
                                  ? {
                                      value: form.coa_group_pkid,
                                      label:
                                        listCoaGroupDataByAccountType?.find(
                                          (item: OptionSelect) =>
                                            item.pkid === form.coa_group_pkid,
                                        )?.name || '',
                                    }
                                  : null
                              }
                              menuPortalTarget={document.body}
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes(
                                    'coa_group_pkid',
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
                          <div>
                            <div className='flex flex-row'>
                              <input
                                type='checkbox'
                                className='form-checkbox'
                                onChange={() => setUseSubAkun(!useSubAkun)}
                                checked={useSubAkun}
                              />
                              <label htmlFor='category_pkid'>
                                Sub Akun{' '}
                                {useSubAkun && (
                                  <span style={{ color: 'red' }}>*</span>
                                )}
                              </label>
                            </div>
                            {useSubAkun && (
                              <Select
                                id='sub_account'
                                placeholder='Pilih Sub Akun'
                                name='sub_account'
                                className='basic-single'
                                options={listCoaDataByCoaGroup?.map(
                                  (item: OptionSelect) => ({
                                    value: item.pkid as number,
                                    label: item.name.toString() + item.number,
                                  }),
                                )}
                                onChange={(
                                  selectedOption: SelectedOption | null,
                                ) =>
                                  handleOnChange(
                                    selectedOption?.value || null,
                                    'sub_account',
                                  )
                                }
                                isSearchable={true}
                                isClearable={true}
                                value={
                                  form.sub_account
                                    ? {
                                        value: form.sub_account,
                                        label:
                                          listCoaDataByCoaGroup?.find(
                                            (item: OptionSelect) =>
                                              item.pkid === form.sub_account,
                                          )?.name || '',
                                      }
                                    : null
                                }
                                menuPortalTarget={document.body}
                                styles={{
                                  control: provided => ({
                                    ...provided,
                                    borderColor: emptyField.includes(
                                      'sub_account',
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
                            )}
                          </div>
                          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div>
                              <label htmlFor='name'>
                                Kode Perkiraan{' '}
                                <span style={{ color: 'red' }}>*</span>
                              </label>
                              <input
                                id='name'
                                type='text'
                                placeholder='Nilai Sisa Aset'
                                className='form-input'
                                onChange={e =>
                                  handleOnChange(
                                    String(e.target.value),
                                    'number',
                                  )
                                }
                                value={form.number || ''}
                                style={{
                                  borderColor: emptyField.includes('number')
                                    ? 'red'
                                    : '',
                                }}
                              />
                            </div>
                            <div className='flex h-full flex-row items-center'>
                              <input
                                type='checkbox'
                                className='form-checkbox'
                                onChange={() =>
                                  setPengkodeanOtomatis(!pengkodeanOtomatis)
                                }
                                checked={pengkodeanOtomatis}
                              />
                              <label htmlFor='name'>
                                Pengkodean Otomatis{' '}
                                <span style={{ color: 'red' }}>*</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label htmlFor='name'>
                              Nama <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                              id='name'
                              type='text'
                              placeholder='Nilai Sisa Aset'
                              className='form-input'
                              onChange={e =>
                                handleOnChange(String(e.target.value), 'name')
                              }
                              value={form.name || ''}
                              style={{
                                borderColor: emptyField.includes('name')
                                  ? 'red'
                                  : '',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div>
                        <div className='flex items-start pt-5'>
                          <div className='flex-auto'>
                            <div className='space-y-5'>
                              <div>
                                <label htmlFor='per_tanggal'>
                                  Per Tanggal{' '}
                                  <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Flatpickr
                                  id='per_tanggal'
                                  name='per_tanggal'
                                  placeholder='Pilih Tanggal'
                                  options={{
                                    dateFormat: 'Y-m-d',
                                    position: isRtl
                                      ? 'auto right'
                                      : 'auto left',
                                  }}
                                  className='form-input'
                                  onChange={date =>
                                    handleOnChange(date[0], 'per_tanggal')
                                  }
                                  value={form.per_tanggal || ''}
                                  style={{
                                    borderColor: emptyField.includes(
                                      'per_tanggal',
                                    )
                                      ? 'red'
                                      : '',
                                  }}
                                />
                              </div>

                              <div className='mb-5'>
                                <label htmlFor='quantity'>Nilai (Rupiah)</label>
                                <div className='flex'>
                                  <div className='border-white-light flex items-center justify-center border bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]'>
                                    Rp
                                  </div>
                                  <input
                                    id='opening_balance'
                                    type='text'
                                    placeholder='Nilai Akun'
                                    className='form-input ltr:rounded-l-none rtl:rounded-r-none'
                                    onChange={e =>
                                      handleOnChange(
                                        String(e.target.value),
                                        'opening_balance',
                                      )
                                    }
                                    style={{
                                      borderColor: emptyField.includes(
                                        'opening_balance',
                                      )
                                        ? 'red'
                                        : '',
                                    }}
                                    value={form.opening_balance || ''}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className='pt-5'>
                        <div className='space-y-5'>
                          <div>
                            <label htmlFor='description'>
                              Informasi Tambahan{' '}
                              <span style={{ color: 'red' }}>*</span>
                            </label>
                            <textarea
                              id='description'
                              name='description'
                              rows={3}
                              className='form-textarea'
                              placeholder='Enter description'
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
                    <Tab.Panel>Disabled</Tab.Panel>
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

export default ModalCoa;
