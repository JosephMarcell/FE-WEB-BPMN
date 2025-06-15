import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import IconLoader from '@/components/icon/icon-loader';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useGetAllCashAccount } from '@/app/api/hooks/cash_bank/cash_account/useGetAllCashAccount';
import { useCreateCashDisbursement } from '@/app/api/hooks/cash_bank/cash_disbursement/useCreateCashDisbursement';
import { useGetEligiblePurchaseDownPaymentInvoice } from '@/app/api/hooks/cash_bank/cash_disbursement/useGetEligiblePurchaseDownPaymentInvoice';
import { useGetEligiblePurchaseInvoice } from '@/app/api/hooks/cash_bank/cash_disbursement/useGetEligiblePurchaseInvoice';
import { PurchaseDownPaymentInvoiceDetail } from '@/helpers/utils/account_payable/purchase_down_payment_invoice';
import { PurchaseInvoiceDetail } from '@/helpers/utils/account_payable/purchase_invoice';
import { CashAccount } from '@/helpers/utils/cash_bank/cash_account';
import {
  cashDisbursementInitialState,
  PaymentMethodOption,
  PaymentTypeOption,
} from '@/helpers/utils/cash_bank/cash_disbursement';
import { SelectOptionProperty } from '@/helpers/utils/component/select';
import { isErrorResponse } from '@/helpers/utils/response_api/response_api';

interface IModalCreateCashDisbursementProps {
  modal: boolean;
  setModal: (value: boolean) => void;
  refetch: () => void;
}

const ModalCreateCashDisbursement = ({
  modal,
  setModal,
  refetch,
}: IModalCreateCashDisbursementProps) => {
  useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listCashAccount } = useGetAllCashAccount();
  const { data: eligiblePurchaseInvoices } = useGetEligiblePurchaseInvoice();
  const { data: eligiblePurchaseDownPaymentInvoices } =
    useGetEligiblePurchaseDownPaymentInvoice();
  const createCashDisbursement = useCreateCashDisbursement();

  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [cashAccountDropdown, setCashAccountDropdown] = useState<
    SelectOptionProperty[]
  >([]);
  const [referenceCodeDropdown, setReferenceCodeDropdown] = useState<
    SelectOptionProperty[]
  >([]);
  const [form, setForm] = useState(cashDisbursementInitialState);
  const [emptyField, setEmptyField] = useState<string[]>([]);
  const [selectedCashAccount, setSelectedCashAccount] =
    useState<CashAccount | null>(null);

  useEffect(() => {
    if (listCashAccount) {
      setCashAccountDropdown(
        listCashAccount.map((item: CashAccount) => ({
          value: item.code,
          label: `${item.code} - ${item.cash_name}`,
        })),
      );
    }
  }, [listCashAccount]);

  useEffect(() => {
    if (form.payment_type === 'invoice' && eligiblePurchaseInvoices) {
      setReferenceCodeDropdown(
        eligiblePurchaseInvoices.map((item: PurchaseInvoiceDetail) => ({
          value: item.code,
          label: item.code,
        })),
      );
    } else if (
      form.payment_type === 'invoice-dp' &&
      eligiblePurchaseDownPaymentInvoices
    ) {
      setReferenceCodeDropdown(
        eligiblePurchaseDownPaymentInvoices.map(
          (item: PurchaseDownPaymentInvoiceDetail) => ({
            value: item.code,
            label: item.code,
          }),
        ),
      );
    }
  }, [
    form.payment_type,
    eligiblePurchaseInvoices,
    eligiblePurchaseDownPaymentInvoices,
  ]);

  const getAdminFee = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'transfer':
        return 6500;
      case 'cash':
        return 0;
      case 'skn':
        return 2900;
      case 'rtgs':
        return 30000;
      case 'bi-fast':
        return 2500;
      case 'foreign-transfer':
        return 50000;
      case 'other':
        return 0;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const adminFee = getAdminFee(form.payment_method);
    setForm(prev => ({ ...prev, admin_fee: adminFee }));
  }, [form.payment_method]);

  const updateDisbursementAmount = useCallback(() => {
    if (form.payment_type === 'invoice') {
      const selectedInvoice = eligiblePurchaseInvoices?.find(
        (invoice: PurchaseInvoiceDetail) =>
          invoice.code === form.reference_code,
      );
      if (selectedInvoice) {
        setForm(prev => ({
          ...prev,
          disbursement_amount: parseInt(selectedInvoice.total.toString()),
        }));
      }
    } else if (form.payment_type === 'invoice-dp') {
      const selectedInvoiceDP = eligiblePurchaseDownPaymentInvoices?.find(
        (invoice: PurchaseDownPaymentInvoiceDetail) =>
          invoice.code === form.reference_code,
      );
      if (selectedInvoiceDP) {
        setForm(prev => ({
          ...prev,
          disbursement_amount: parseInt(selectedInvoiceDP.paid.toString()),
        }));
      }
    }
  }, [
    form.payment_type,
    form.reference_code,
    eligiblePurchaseInvoices,
    eligiblePurchaseDownPaymentInvoices,
  ]);

  useEffect(() => {
    updateDisbursementAmount();
  }, [updateDisbursementAmount]);

  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
  ) => {
    if (name === 'disbursement_amount' && typeof value === 'string') {
      const parsedValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
      setForm(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
    } else if (
      name === 'admin_fee' &&
      (form.payment_method === 'cash' || form.payment_method === 'other')
    ) {
      const parsedValue = parseInt(value as string) || 0;
      setForm(prev => ({
        ...prev,
        [name]: parsedValue,
      }));
    } else if (name.includes('date') && value instanceof Date) {
      const newDate = new Date(value);
      newDate.setHours(12, 0, 0, 0);
      setForm({ ...form, [name]: newDate });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelectChange = (
    value:
      | SingleValue<SelectOptionProperty>
      | SingleValue<PaymentMethodOption>
      | SingleValue<PaymentTypeOption>,
    name: string,
  ) => {
    if (value) {
      setForm(prev => ({ ...prev, [name]: value.value }));
      if (name === 'cash_account_code') {
        const selectedAccount = listCashAccount?.find(
          account => account.code === value.value,
        );
        setSelectedCashAccount(selectedAccount || null);
      }
    }
  };

  const mandatoryValidation = () => {
    const requiredFields: (keyof typeof form)[] = [
      'cash_account_code',
      'reference_code',
      'disbursement_date',
      'payment_method',
      'payment_type',
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
          await createCashDisbursement.mutateAsync(form);
          setForm(cashDisbursementInitialState);
          setIsLoadingCreate(false);
          setModal(false);
          Swal.fire(
            'Saved!',
            'Your cash disbursement has been saved.',
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

  const formatCurrencyDisplay = (amount: number | null) => {
    if (amount === null) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as='div' open={modal} onClose={() => setModal(false)}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'>
          <form className='flex min-h-screen items-start justify-center px-4'>
            <Dialog.Panel className='my-8 w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg'>
              <div className='flex items-center justify-between border-b p-5 text-black'>
                <h5 className='text-lg font-bold'>
                  Create New Cash Disbursement
                </h5>
                <button
                  onClick={() => setModal(false)}
                  className='text-gray-400 hover:text-gray-500'
                >
                  <IconX />
                </button>
              </div>
              <div className='space-y-4 p-5 text-black'>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label htmlFor='cash_account_code'>
                      Cash Account <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={cashAccountDropdown}
                      onChange={value =>
                        handleSelectChange(value, 'cash_account_code')
                      }
                      value={
                        cashAccountDropdown.find(
                          option => option.value === form.cash_account_code,
                        ) || null
                      }
                    />
                  </div>
                </div>
                {selectedCashAccount && (
                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <label htmlFor='account_name'>Account Name</label>
                      <input
                        id='account_name'
                        type='text'
                        className='form-input'
                        value={selectedCashAccount.account_name}
                        disabled
                      />
                    </div>
                    <div>
                      <label htmlFor='account_type'>Account Type</label>
                      <input
                        id='account_type'
                        type='text'
                        className='form-input'
                        value={selectedCashAccount.account_type}
                        disabled
                      />
                    </div>
                    <div>
                      <label htmlFor='balance'>Balance</label>
                      <input
                        id='balance'
                        type='text'
                        className='form-input'
                        value={formatCurrencyDisplay(
                          selectedCashAccount.balance,
                        )}
                        disabled
                      />
                    </div>
                  </div>
                )}
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='payment_type'>
                      Payment Type <span className='text-red-500'>*</span>
                    </label>
                    <Select<PaymentTypeOption>
                      options={[
                        { value: 'invoice', label: 'Invoice' },
                        { value: 'invoice-dp', label: 'Invoice DP' },
                        { value: 'non-invoice', label: 'Non-Invoice' },
                        { value: 'other', label: 'Other' },
                      ]}
                      onChange={value =>
                        handleSelectChange(value, 'payment_type')
                      }
                      value={
                        form.payment_type
                          ? {
                              value: form.payment_type,
                              label: form.payment_type,
                            }
                          : null
                      }
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor: emptyField.includes('payment_type')
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
                  <div>
                    <label htmlFor='reference_code'>
                      Reference Code <span className='text-red-500'>*</span>
                    </label>
                    <Select
                      options={referenceCodeDropdown}
                      onChange={value =>
                        handleSelectChange(value, 'reference_code')
                      }
                      value={
                        referenceCodeDropdown.find(
                          option => option.value === form.reference_code,
                        ) || null
                      }
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor: emptyField.includes('reference_code')
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
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='disbursement_date'>
                      Disbursement Date <span className='text-red-500'>*</span>
                    </label>
                    <Flatpickr
                      id='disbursement_date'
                      name='disbursement_date'
                      placeholder='Select Date'
                      options={{
                        dateFormat: 'Y-m-d',
                        position: 'auto left',
                      }}
                      className='form-input'
                      onChange={date =>
                        handleOnChange(date[0], 'disbursement_date')
                      }
                      value={form.disbursement_date || ''}
                      style={{
                        borderColor: emptyField.includes('disbursement_date')
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor='payment_method'>
                      Payment Method <span className='text-red-500'>*</span>
                    </label>
                    <Select<PaymentMethodOption>
                      options={[
                        { value: 'transfer', label: 'Transfer' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'other', label: 'Other' },
                      ]}
                      onChange={value =>
                        handleSelectChange(value, 'payment_method')
                      }
                      value={
                        form.payment_method
                          ? {
                              value: form.payment_method,
                              label: form.payment_method,
                            }
                          : null
                      }
                      styles={{
                        control: base => ({
                          ...base,
                          borderColor: emptyField.includes('payment_method')
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
                    <label htmlFor='disbursement_amount'>
                      Disbursement Amount
                    </label>
                    <input
                      id='disbursement_amount'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'disbursement_amount')
                      }
                      value={formatCurrencyDisplay(form.disbursement_amount)}
                      placeholder='Example: 13320000'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <div>
                    <label htmlFor='admin_fee'>Admin Fee</label>
                    <input
                      id='admin_fee'
                      type='text'
                      className='form-input'
                      onChange={e =>
                        handleOnChange(e.target.value, 'admin_fee')
                      }
                      value={
                        form.payment_method === 'cash' ||
                        form.payment_method === 'other'
                          ? form.admin_fee
                          : formatCurrencyDisplay(form.admin_fee || 0)
                      }
                      placeholder='Example: 6500'
                      disabled={
                        form.payment_method !== 'cash' &&
                        form.payment_method !== 'other'
                      }
                    />
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

export default ModalCreateCashDisbursement;
