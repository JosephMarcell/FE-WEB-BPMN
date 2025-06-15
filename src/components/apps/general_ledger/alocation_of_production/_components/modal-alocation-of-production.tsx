import { Dialog, Tab, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAssetCategoryByPkid } from '@/app/api/hooks/fixed_asset/asset_category/useGetAssetCategoryByPkid';
import { useGetAllMachineOverhead } from '@/app/api/hooks/general_ledger/account_calculation/useGetAllMachineOverhead';
import { useCreateAlocationOfProduction } from '@/app/api/hooks/general_ledger/alocation_of_production/useCreateAlocationOfProduction';
import { alocationOfProductionInitialState } from '@/helpers/utils/company/alocation_of_production';
import { OverheadManufactureProperty } from '@/helpers/utils/general_ledger/overheadManufacture';
import { PeriodDateFormatter } from '@/helpers/utils/global/dateFormatter';
import { listMonths, listYears } from '@/helpers/utils/global/listDate';

interface IModalRegisterAssetCategoryProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}

const ModalAlocationofProduction = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalRegisterAssetCategoryProps) => {
  const { mutateAsync: createAlocationOfProduction } =
    useCreateAlocationOfProduction();
  const { mutateAsync: getAllMachineOverhead } = useGetAllMachineOverhead();
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);
  const [form, setForm] = useState(alocationOfProductionInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);

  const [selectedRows, setSelectedRows] = useState<
    OverheadManufactureProperty[]
  >([]);

  const [selectAll, setSelectAll] = useState(false);

  const handleToggleRow = (row: OverheadManufactureProperty) => {
    const isSelected = selectedRows.some(
      selectedRow => selectedRow.coa_pkid === row.coa_pkid,
    );
    if (isSelected) {
      const filteredRows = selectedRows.filter(
        selectedRow => selectedRow.coa_pkid !== row.coa_pkid,
      );
      setSelectedRows(filteredRows);
      setForm({ ...form, list_production_expense: filteredRows });
    } else {
      setSelectedRows([...selectedRows, row]);
      setForm({ ...form, list_production_expense: [...selectedRows, row] });
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setForm({ ...form, list_production_expense: [] });
    } else {
      setSelectedRows([...detailProductionExpense]);
      setForm({ ...form, list_production_expense: detailProductionExpense });
    }
    setSelectAll(!selectAll);
  };

  const [detailProductionExpense, setDetailProductionExpense] = useState<
    OverheadManufactureProperty[]
  >([]);
  const {
    data: assetCategoryDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetAssetCategoryByPkid(pkid);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      refetchDetail();
      setForm(assetCategoryDetail);
    }
  }, [pkid, modalEdit, assetCategoryDetail, isLoading, refetchDetail]);

  const mandatoryValidation = () => {
    const temp = { ...form };
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
    value: string | number | null | undefined,
    key: string,
  ) => {
    setForm({ ...form, [key]: value });
  };

  const handleCancel = () => {
    if (
      JSON.stringify(form) === JSON.stringify(alocationOfProductionInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(alocationOfProductionInitialState);
      setEmptyField([]);
      setSelectedRows([]);
      setDetailProductionExpense([]);
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
            setForm(alocationOfProductionInitialState);
            setEmptyField([]);
            setSelectedRows([]);
            setDetailProductionExpense([]);
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
            const responseData = {
              isSuccess: false,
              message: '',
            };
            if (modalEdit) {
              setModalEdit(false);
            }
            if (modal) {
              const response = await createAlocationOfProduction(form);
              responseData.isSuccess = response.isSuccess;
              responseData.message = response.message;
              setModal(false);
            }
            setForm(alocationOfProductionInitialState);
            setEmptyField([]);
            setDetailProductionExpense([]);
            if (responseData.isSuccess) {
              Swal.fire(
                'Saved!',
                'Your Alocation of Production has been saved.',
                'success',
              ).then(() => {
                refetch();
              });
            } else {
              Swal.fire('Error!', responseData.message, 'error');
            }
          } catch (error) {
            Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(alocationOfProductionInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };

  const handleAlocateProductionExpense = async () => {
    if (form.month && form.year) {
      const period = PeriodDateFormatter.getFormattedMonthDates(
        form.month ?? '',
        Number(form.year),
      );
      const response = await getAllMachineOverhead({
        start_date: period[0],
        end_date: period[1],
      });

      if (response) {
        setDetailProductionExpense(response);
      } else {
        setDetailProductionExpense([]);
        Swal.fire('Error!', 'You Do not have any expense to alocate', 'error');
      }
    } else {
      Swal.fire('Error!', 'Data Month or Year is empty', 'error');
    }
  };
  const handlePercentageChange = (
    value: string,
    row: OverheadManufactureProperty,
  ) => {
    const percentage = parseFloat(value);

    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      const adjustedPrice = (row.price * percentage) / 100;

      const updatedRows = detailProductionExpense.map(item => {
        if (item.coa_pkid === row.coa_pkid) {
          const updatedRow = {
            ...item,
            percentage,
            result_price: adjustedPrice,
          };
          if (
            selectedRows.some(
              selectedRow => selectedRow.coa_pkid === row.coa_pkid,
            )
          ) {
            setSelectedRows(prevRows =>
              prevRows.map(selectedRow =>
                selectedRow.coa_pkid === row.coa_pkid
                  ? updatedRow
                  : selectedRow,
              ),
            );
          }
          return updatedRow;
        }
        return item;
      });

      setDetailProductionExpense(updatedRows);
    }
  };
  useEffect(() => {
    if (selectedRows.length > 0) {
      setForm(prevForm => ({
        ...prevForm,
        list_production_expense: selectedRows,
      }));
    }
  }, [selectedRows, detailProductionExpense]);

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
                <h5 className='text-lg font-bold'>
                  {modal ? 'New' : 'Edit'} Alocation of Production
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
                          Period of Alocation
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
                          } hover:text-primary -mb-[1px] block border border-transparent p-3.5 py-2 dark:hover:border-b-black`}
                        >
                          Detail Production Expense
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
                          } hover:text-primary -mb-[1px] block border border-transparent p-3.5 py-2 dark:hover:border-b-black`}
                        >
                          Detail Production Order
                        </button>
                      )}
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className='text-sm'>
                    <Tab.Panel>
                      <div className='active pt-5'>
                        <div className='space-y-5'>
                          <div>
                            <label htmlFor='month'>
                              Pilih Bulan<span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                              id='month'
                              placeholder='Pilih Tipe Aset'
                              name='month'
                              className='basic-single'
                              options={listMonths}
                              isSearchable={true}
                              isClearable={true}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value ?? null,
                                  'month',
                                )
                              }
                              value={
                                form.month
                                  ? {
                                      value: form.month ?? '',
                                      label: form.month ?? '',
                                    }
                                  : null
                              }
                              menuPortalTarget={document.body}
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes('month')
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
                            <label htmlFor='year'>
                              Pilih Tahun<span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                              id='year'
                              placeholder='Pilih Tipe Aset'
                              name='year'
                              className='basic-single'
                              options={listYears}
                              isSearchable={true}
                              isClearable={true}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value ?? null,
                                  'year',
                                )
                              }
                              value={
                                form.year
                                  ? {
                                      value: form.year ?? '',
                                      label: form.year ?? '',
                                    }
                                  : null
                              }
                              menuPortalTarget={document.body}
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes('year')
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
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className='pt-5'>
                        <div className='space-y-5'>
                          <div>
                            <button
                              onClick={handleAlocateProductionExpense}
                              type='button'
                              className='btn btn-outline-primary ltr:ml-4 rtl:mr-4'
                            >
                              Alocate
                            </button>
                          </div>
                          <div className='overflow-x-auto'>
                            <table className='w-full min-w-[600px] table-auto divide-y divide-gray-200'>
                              <thead className='bg-gray-50 dark:bg-[#1e212d]'>
                                <tr>
                                  <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                                  >
                                    <input
                                      type='checkbox'
                                      checked={selectAll}
                                      onChange={handleToggleSelectAll}
                                      className='form-checkbox text-primary h-5 w-5'
                                    />
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                                  >
                                    Standard Price
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                                  >
                                    Percentage
                                  </th>
                                  <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300'
                                  >
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='divide-y divide-gray-200 bg-white dark:bg-gray-800'>
                                {detailProductionExpense.map(row => (
                                  <tr
                                    key={row.coa_pkid}
                                    className='hover:bg-gray-50 dark:hover:bg-[#2b3148]'
                                  >
                                    <td className='whitespace-nowrap px-6 py-4'>
                                      <input
                                        type='checkbox'
                                        checked={selectedRows.some(
                                          selectedRow =>
                                            selectedRow.coa_pkid ===
                                            row.coa_pkid,
                                        )}
                                        onChange={() => handleToggleRow(row)}
                                        className='form-checkbox text-primary h-5 w-5'
                                      />
                                    </td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                      <div className='text-sm font-medium text-gray-900'>
                                        {row.name}
                                      </div>
                                    </td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                      <div className='text-sm text-gray-900'>
                                        {row.price}
                                      </div>
                                    </td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                      <div className='text-sm text-gray-900'>
                                        <input
                                          type='number'
                                          value={row.percentage}
                                          onChange={e =>
                                            handlePercentageChange(
                                              e.target.value,
                                              row,
                                            )
                                          }
                                          className='form-input w-20 border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-300'
                                        />
                                      </div>
                                    </td>
                                    <td className='whitespace-nowrap px-6 py-4'>
                                      <div className='text-sm text-gray-900'>
                                        {row.result_price}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
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

export default ModalAlocationofProduction;
