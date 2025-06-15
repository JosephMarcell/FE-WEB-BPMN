import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateBankAccount } from '@/app/api/hooks/cash_bank/bank_account/useCreateBankAccount';
import { useGetAllListBank } from '@/app/api/hooks/cash_bank/list_bank/useGetAllListBank';
import { useGetCoaByCoaGroup } from '@/app/api/hooks/general_ledger/coa/useGetCoaByCoaGroup';
import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import { Bank } from '@/helpers/utils/cash_bank/bank';
import {
  AccountTypeOption,
  bankAccountInitialState,
  Currency,
} from '@/helpers/utils/cash_bank/bank_account';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import { CoaPropertyWithPkid } from '@/helpers/utils/general_ledger/coa';
import { isErrorResponse } from '@/helpers/utils/response_api/response_api';

interface IModalCreateBankAccountProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalCreateBankAccount = ({
  modal,
  setModal,
  refetch,
}: IModalCreateBankAccountProps) => {
  useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listCurrency } = useGetAllCurrency();
  const { data: listBank } = useGetAllListBank();
  const { mutate: getCoaByCoaGroup, data: listCoaResponse } =
    useGetCoaByCoaGroup();
  const createBankAccount = useCreateBankAccount();

  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [currencyDropdown, setCurrencyDropdown] = useState<
    SelectOptionProperty[]
  >([]);
  const [coaDropdown, setCoaDropdown] = useState<SelectOptionProperty[]>([]);
  const [bankDropdown, setBankDropdown] = useState<SelectOptionProperty[]>([]);
  const [form, setForm] = useState(bankAccountInitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [selectedBankInfo, setSelectedBankInfo] = useState<Partial<Bank>>({});
  const [descriptionLength, setDescriptionLength] = useState<number>(0);

  useEffect(() => {
    if (listCurrency) {
      setCurrencyDropdown(
        listCurrency.map((item: Currency) => ({
          value: item.code,
          label: item.name,
        })),
      );
    }
  }, [listCurrency]);

  useEffect(() => {
    if (listBank) {
      setBankDropdown(
        listBank.map((item: Bank) => ({
          value: item.bank_name,
          label: item.bank_name,
        })),
      );
    }
  }, [listBank]);

  useEffect(() => {
    getCoaByCoaGroup({ coaGroupIds: [1, 2] });
  }, [getCoaByCoaGroup]);

  useEffect(() => {
    if (listCoaResponse && Array.isArray(listCoaResponse.data)) {
      setCoaDropdown(
        listCoaResponse.data.map((item: CoaPropertyWithPkid) => ({
          value: item.pkid ?? '',
          label: item.name ?? '',
        })),
      );
    }
  }, [listCoaResponse]);

  useEffect(() => {
    const defaultCurrency = currencyDropdown.find(c => c.value === 'IDR');
    if (defaultCurrency) {
      setForm(prev => ({ ...prev, currency_code: defaultCurrency.value }));
    }
  }, [currencyDropdown]);

  const sanitizeInput = (input: string) => {
    const pattern = /[*'";{}()<>[\]]/g;
    return input.replace(pattern, '');
  };

  const handleOnChange = (
    value: string | number | boolean | null,
    name: string,
  ) => {
    if (name === 'balance' && typeof value === 'string') {
      const parsedValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
      setForm(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
    } else if (
      name === 'account_name' ||
      name === 'branch_name' ||
      name === 'account_number' ||
      name === 'description'
    ) {
      const sanitizedValue = sanitizeInput(value as string);
      setForm({ ...form, [name]: sanitizedValue });
      if (name === 'description') {
        setDescriptionLength(sanitizedValue.length);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (
    value: SingleValue<SelectOptionProperty> | SingleValue<AccountTypeOption>,
    name: string,
  ) => {
    if (value) {
      setForm(prev => ({ ...prev, [name]: value.value }));

      if (name === 'bank_name' && listBank) {
        const selectedBank = listBank.find(
          bank => bank.bank_name === value.value,
        );
        if (selectedBank) {
          setSelectedBankInfo({
            bank_code: selectedBank.bank_code,
            country: selectedBank.country,
            bank_short_name: selectedBank.bank_short_name,
          });
        } else {
          setSelectedBankInfo({});
        }
      }
    }
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = [
      'currency_code',
      'coa_id',
      'bank_name',
      'branch_name',
      'account_number',
      'account_name',
      'account_type',
      'balance',
    ];

    const missingFields = requiredFields.filter(field => !form[field]);
    setEmptyField(missingFields);
    return missingFields.length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!mandatoryValidation()) {
      await Swal.fire({
        title: 'Some Fields are Empty',
        text: 'Please fill all mandatory fields',
        icon: 'error',
        confirmButtonText: 'Close',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Make sure all data is correct',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Save it!',
      cancelButtonText: 'No, cancel!',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          setIsLoadingCreate(true);
          await createBankAccount.mutateAsync(form);
          setForm(bankAccountInitialState);
          setIsLoadingCreate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your bank account has been saved.',
            'success',
          ).then(() => {
            refetch();
          });
        } catch (error) {
          setIsLoadingCreate(false);
          let errorMessage = 'Something went wrong';
          if (isErrorResponse(error)) {
            const responseMessage = error.response.data.message;
            errorMessage = responseMessage
              ? responseMessage.replace(/^[A-Z]{2} - /, '')
              : errorMessage;
          }
          await Swal.fire('Error!', errorMessage, 'error');
        }
      }
    });
  };

  const formatCurrencyDisplay = (
    value: number,
    currencyCode: string,
  ): string => {
    if (isNaN(value)) return '';
    return `${currencyCode} ${value.toLocaleString('en-US')}`;
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(false)}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'>
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='my-8 w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg'>
              <div className='flex items-center justify-between border-b p-5 text-black'>
                <h5 className='text-lg font-bold'>Create New Bank Account</h5>
                <button
                  onClick={() => setModal(false)}
                  className='text-gray-400 hover:text-gray-500'
                >
                  <IconX />
                </button>
              </div>
              <div className='p-5 text-black'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='currency_code'>
                      Currency Code <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={currencyDropdown}
                      onChange={value =>
                        handleSelectChange(value, 'currency_code')
                      }
                      value={
                        currencyDropdown.find(
                          option => option.value === form.currency_code,
                        ) || null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='coa_id'>
                      COA ID <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={coaDropdown}
                      onChange={value => handleSelectChange(value, 'coa_id')}
                      value={
                        coaDropdown.find(
                          option => option.value === form.coa_id,
                        ) || null
                      }
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='bank_name'>
                      Bank Name <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={bankDropdown}
                      onChange={value => handleSelectChange(value, 'bank_name')}
                      value={
                        bankDropdown.find(
                          option => option.value === form.bank_name,
                        ) || null
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor='branch_name'>
                      Branch Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='branch_name'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'branch_name')
                      }
                      value={form.branch_name?.toString()}
                      placeholder='Example: Surabaya Branch'
                      style={{
                        borderColor: emptyField.includes('branch_name')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                </div>
                {selectedBankInfo.bank_code && (
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <label htmlFor='bank_code'>Bank Code</label>
                      <input
                        id='bank_code'
                        type='text'
                        className='form-input'
                        value={selectedBankInfo.bank_code || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor='bank_country'>Bank Country</label>
                      <input
                        id='bank_country'
                        type='text'
                        className='form-input'
                        value={selectedBankInfo.country || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor='bank_short_name'>Bank Short Name</label>
                      <input
                        id='bank_short_name'
                        type='text'
                        className='form-input'
                        value={selectedBankInfo.bank_short_name || ''}
                        readOnly
                      />
                    </div>
                  </div>
                )}
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label htmlFor='account_number'>
                      Account Number <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='account_number'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'account_number')
                      }
                      value={form.account_number?.toString()}
                      placeholder='Example: 1231231230'
                      style={{
                        borderColor: emptyField.includes('account_number')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='account_name'>
                      Account Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='account_name'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'account_name')
                      }
                      value={form.account_name?.toString()}
                      placeholder='Example: Primary Account'
                      style={{
                        borderColor: emptyField.includes('account_name')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='account_type'>
                      Account Type <span className='text-red-500'>*</span>
                    </label>
                    <Select<AccountTypeOption>
                      options={[
                        { value: 'Savings', label: 'Savings' },
                        { value: 'Checking', label: 'Checking' },
                        { value: 'Business', label: 'Business' },
                        { value: 'Loan', label: 'Loan' },
                        { value: 'Credit', label: 'Credit' },
                        { value: 'Investment', label: 'Investment' },
                        { value: 'Fixed Deposit', label: 'Fixed Deposit' },
                        { value: 'Other', label: 'Other' },
                      ]}
                      onChange={value =>
                        handleSelectChange(value, 'account_type')
                      }
                      value={
                        form.account_type
                          ? {
                              value: form.account_type,
                              label: form.account_type,
                            }
                          : null
                      }
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor: emptyField.includes('account_type')
                            ? 'red'
                            : base.borderColor,
                        }),
                        menuPortal: base => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <div>
                    <label htmlFor='balance'>
                      Balance <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='balance'
                      type='text'
                      className='form-input'
                      onChange={e => handleOnChange(e.target.value, 'balance')}
                      value={formatCurrencyDisplay(
                        form.balance ?? 0,
                        form.currency_code ?? '',
                      )}
                      placeholder='Example: 300000000'
                      style={{
                        borderColor: emptyField.includes('balance')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='col-span-3'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                      id='description'
                      className='form-textarea mt-1 block w-full'
                      rows={3}
                      maxLength={255}
                      onChange={e =>
                        handleOnChange(e.target.value, 'description')
                      }
                      value={form.description || ''}
                    />
                    <div className='text-right text-sm text-gray-500'>
                      {descriptionLength}/255
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-end p-5'>
                {isLoadingCreate ? (
                  <button type='button' className='btn'>
                    <IconLoader /> Loading
                  </button>
                ) : (
                  <button
                    type='submit'
                    className='btn btn-primary'
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Dialog.Panel>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalCreateBankAccount;
