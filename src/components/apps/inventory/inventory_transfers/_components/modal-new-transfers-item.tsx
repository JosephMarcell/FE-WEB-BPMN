// import deleteBaseAttributes from '@/hooks/deleteBaseAttribute';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import Swal from 'sweetalert2';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { useCreateInventoryTransfer } from '@/app/api/hooks/inventory/inventory_transfer/useCreateInventoryTransfer';
import { useGetInventoryTransferByPkid } from '@/app/api/hooks/inventory/inventory_transfer/useGetInventoryTransferByPkid';
import { useUpdateInventoryTransfer } from '@/app/api/hooks/inventory/inventory_transfer/useUpdateInventoryTransfer';
import { useGetAllItem } from '@/app/api/hooks/inventory/items/item/useGetAllItem';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useGetPurchaseOrderByPkid } from '@/app/api/hooks/purchasing/purchase_order/useGetPurchaseOrderByPkid';
import { usePurchaseOrderForDropdown } from '@/app/api/hooks/purchasing/purchase_order/usePurchaseOrderForDropdown';
import { useGetSupplierForDropdown } from '@/app/api/hooks/purchasing/supplier/useGetSupplierForDropdown';
import { useGetCustomerForDropdown } from '@/app/api/hooks/sales/customer/useGetCustomerForDropdown';
import { useGetSalesOrderByPkid } from '@/app/api/hooks/sales/sales_order/useGetSalesOrderByPkid';
import { useSalesOrderForDropdown } from '@/app/api/hooks/sales/sales_order/useSalesOrderForDropdown';
import {
  transferStatus,
  transferType,
} from '@/helpers/utils/inventory/inventory_transfer_item';
import {
  inventoryTransferItemDetailInitialState,
  InventoryTransferItemDetailProperty,
  inventoryTransferItemInitialState,
} from '@/helpers/utils/inventory/inventory_transfer_item';
import { PurchaseOrderDetailProperty } from '@/helpers/utils/purchasing/purchase_order';
import { SalesOrderDetailProperty } from '@/helpers/utils/sales/sales';

interface IModalNewReceiveItemProps {
  modal: boolean;
  modalEdit: boolean;
  setModal: (value: boolean) => void;
  setModalEdit: (value: boolean) => void;
  refetch: () => void;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
interface SelectedOption {
  value: string | number | null | undefined;
  label: string | number;
}
const ModalNewReceiveItem = ({
  modal,
  modalEdit,
  setModal,
  setModalEdit,
  refetch,
}: IModalNewReceiveItemProps) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const pkid = useSelector((state: IRootState) => state.themeConfig.pkid);

  const [form, setForm] = useState(inventoryTransferItemInitialState);
  const [emptyField, setEmptyField] = useState([] as string[]);
  const [selectedReferenceNumber, setSelectedReferenceNumber] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [enabledPurchasedOrder, setEnabledPurchasedOrder] = useState(false);
  const [enabledSalesOrder, setEnabledSalesOrder] = useState(false);
  const [enabledPurchaseOrderDetail, setEnabledPurchaseOrderDetail] =
    useState(false);
  const [enabledSalesOrderDetail, setEnabledSalesOrderDetail] = useState(false);
  const [transferDetail, setTransferDetail] = useState<
    InventoryTransferItemDetailProperty[]
  >(inventoryTransferItemDetailInitialState);

  const { mutateAsync: createInventoryTransfer } = useCreateInventoryTransfer();
  const { mutateAsync: updateInventoryTransfer } = useUpdateInventoryTransfer();
  const { data: listSupplier } = useGetSupplierForDropdown();
  const { data: listCustomer } = useGetCustomerForDropdown();
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();
  const { data: listItem } = useGetAllItem();
  const { data: listPurchaseOrder } = usePurchaseOrderForDropdown(
    enabledPurchasedOrder,
  );
  const { data: listSalesOrder } = useSalesOrderForDropdown(enabledSalesOrder);
  const {
    data: purchaseOrderDetailData,
    isLoading: isLoadingPurchaseOrderDetail,
  } = useGetPurchaseOrderByPkid(
    selectedReferenceNumber,
    enabledPurchaseOrderDetail,
  );
  const { data: salesOrderDetailData, isLoading: isLoadingSalesOrderDetail } =
    useGetSalesOrderByPkid(selectedReferenceNumber, enabledSalesOrderDetail);

  const {
    data: inventoryTransferDataDetail,
    isLoading,
    refetch: refetchDetail,
  } = useGetInventoryTransferByPkid(pkid, enabled);

  useEffect(() => {
    if (pkid && modalEdit && !isLoading) {
      setEnabled(true);
      refetchDetail();
    }
  }, [pkid, modalEdit, isLoading, refetchDetail]);

  useEffect(() => {
    if (inventoryTransferDataDetail && modalEdit && !isLoading) {
      setForm(inventoryTransferDataDetail);
      setTransferDetail(inventoryTransferDataDetail.transferDetails);
    }
  }, [inventoryTransferDataDetail, modalEdit, isLoading]);

  useEffect(() => {
    if (form.type === 'purchase') {
      setEnabledPurchasedOrder(true);
      setEnabledSalesOrder(false);
    }
    if (form.type === 'sales') {
      setEnabledSalesOrder(true);
      setEnabledPurchasedOrder(false);
    }
  }, [
    form.type,
    form.reference_number,
    setEnabledPurchasedOrder,
    setEnabledSalesOrder,
    form,
  ]);

  useEffect(() => {
    if (form.type === 'purchase' && selectedReferenceNumber) {
      setEnabledPurchaseOrderDetail(true);
      setEnabledSalesOrderDetail(false);

      if (purchaseOrderDetailData && !isLoadingPurchaseOrderDetail) {
        setTransferDetail(
          purchaseOrderDetailData.purchaseOrderDetails.map(
            (item: SalesOrderDetailProperty) => ({
              item_pkid: item.item_pkid,
              item_quantity: item.quantity,
              item_accepted_quantity: item.quantity,
              item_rejected_quantity: 0,
              expiry_date: null,
              notes: item.description,
            }),
          ),
        );
        setForm(prevForm => ({
          ...prevForm,
          supplier_pkid: purchaseOrderDetailData.supplier_id,
        }));
      }
    }
  }, [
    form.type,
    isLoadingPurchaseOrderDetail,
    purchaseOrderDetailData,
    selectedReferenceNumber,
  ]);

  useEffect(() => {
    if (form.type === 'sales' && selectedReferenceNumber) {
      setEnabledSalesOrderDetail(true);
      setEnabledPurchaseOrderDetail(false);

      if (salesOrderDetailData && !isLoadingSalesOrderDetail) {
        setTransferDetail(
          salesOrderDetailData.salesOrderDetails.map(
            (item: PurchaseOrderDetailProperty) => ({
              item_pkid: item.item_pkid,
              item_quantity: item.quantity,
              item_accepted_quantity: item.quantity,
              item_rejected_quantity: 0,
              expiry_date: null,
              notes: item.description,
            }),
          ),
        );

        setForm(prevForm => ({
          ...prevForm,
          customer_pkid: salesOrderDetailData.customer_id,
        }));
      }
    }
  }, [
    form.type,
    isLoadingSalesOrderDetail,
    salesOrderDetailData,
    selectedReferenceNumber,
  ]);
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
      'customer_pkid',
      'supplier_pkid',
      'pkid',
      'code',
      'status',
      'tenant_id',
      'total_quantity',
      'total_accepted_quantity',
      'total_rejected_quantity',
      'from_warehouse_pkid',
      'to_warehouse_pkid',
    ];
    const requiredData = Object.keys(temp).filter(
      data => !excludeItemField.includes(data),
    );

    if (temp.type === 'production') {
      requiredData.push('customer_pkid');
      requiredData.push('supplier_pkid');
    }

    if (temp.type === 'sales') {
      requiredData.push('customer_pkid');
    }

    if (temp.type === 'purchase') {
      requiredData.push('supplier_pkid');
    }

    requiredData.forEach(field => {
      if (
        temp[field as keyof typeof temp] === null ||
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
              const tempForm = { ...form, transferDetails: transferDetail };

              await updateInventoryTransfer({
                pkid: pkid,
                data: tempForm,
              });
              setModalEdit(false);
            }
            if (modal) {
              const inputForm = {
                ...form,
                transferDetails: transferDetail,
              };
              await createInventoryTransfer(inputForm);
              setModal(false);
            }
            setForm(inventoryTransferItemInitialState);
            setEmptyField([]);
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
  const handleOnChange = (
    value: string | number | boolean | Date | null,
    name: string,
    code?: string,
  ) => {
    if (name.includes('date') && value instanceof Date) {
      const date = new Date(value.toString());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      value = `${year}-${month}-${day}`;
    }
    if (name === 'type') {
      if (value === 'purchase') {
        form.is_rejected = false;
        form.customer_pkid = null;
      } else if (value === 'sales') {
        form.is_rejected = true;
        form.supplier_pkid = null;
      } else {
        form.is_rejected = false;
        form.supplier_pkid = null;
        form.customer_pkid = null;
      }
      form.reference_number = null;
      setTransferDetail(inventoryTransferItemDetailInitialState);
      setSelectedReferenceNumber(0);
      setEnabledSalesOrderDetail(false);
      setEnabledPurchaseOrderDetail(false);
    }

    if (name === 'reference_number') {
      setSelectedReferenceNumber((value ?? 0) as number);
      value = code ?? '';
    }
    setForm({ ...form, [name]: value });
  };
  const handleCancel = () => {
    if (
      JSON.stringify(form) === JSON.stringify(inventoryTransferItemInitialState)
    ) {
      if (modalEdit) {
        setModalEdit(false);
      }
      if (modal) {
        setModal(false);
      }
      setForm(inventoryTransferItemInitialState);
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
            setForm(inventoryTransferItemInitialState);
            setEmptyField([]);
            setTransferDetail(inventoryTransferItemDetailInitialState);
          } catch (error) {
            await Swal.fire('Error!', 'Something went wrong', 'error');
          }
        }
      });
    }
  };

  const handleClose = () => {
    if (modalEdit) {
      setModalEdit(false);
      setForm(inventoryTransferItemInitialState);
      setTransferDetail(inventoryTransferItemDetailInitialState);
    }
    if (modal) {
      setModal(false);
    }
  };
  const handleOnChangeInventoryTransferDetail = (
    value: string | number | boolean | Date | null,
    key: string,
    index: number,
  ) => {
    setTransferDetail(
      transferDetail.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    );
  };
  return (
    <div>
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
                    {modal ? 'New' : 'Edit'} Transfer Item
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
                    <div>
                      <label htmlFor='type'>
                        Transfer Type <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Select
                        id='type'
                        placeholder='Choose Trasfer Type'
                        options={transferType}
                        isSearchable={true}
                        isClearable={true}
                        className='basic-single'
                        onChange={(selectedOption: SelectedOption | null) =>
                          handleOnChange(selectedOption?.value || null, 'type')
                        }
                        value={
                          form.type
                            ? {
                                value: form.type ?? '',
                                label:
                                  transferType.find(
                                    (item: { value: string }) =>
                                      item.value === form.type,
                                  )?.label ?? '',
                              }
                            : null
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          control: provided => ({
                            ...provided,
                            borderColor: emptyField.includes('type')
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
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <label htmlFor='from_warehouse_pkid'>
                          Warehouse (From){' '}
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='from_warehouse_pkid'
                          placeholder='Choose Warehouse'
                          options={listWarehouse?.map((item: OptionSelect) => ({
                            value: item.pkid,
                            label: item.name,
                          }))}
                          isSearchable={true}
                          isClearable={true}
                          className='basic-single'
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || null,
                              'from_warehouse_pkid',
                            )
                          }
                          isDisabled={modalEdit}
                          value={
                            form.from_warehouse_pkid
                              ? {
                                  value: form.from_warehouse_pkid ?? '',
                                  label:
                                    listWarehouse?.find(
                                      (item: OptionSelect) =>
                                        item.pkid === form.from_warehouse_pkid,
                                    )?.name ?? '',
                                }
                              : null
                          }
                          menuPortalTarget={document.body}
                          styles={{
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes(
                                'from_warehouse_pkid',
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
                        <label htmlFor='to_warehouse_pkid'>
                          Warehouse (To) <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                          id='to_warehouse_pkid'
                          placeholder='Choose Warehouse'
                          options={listWarehouse?.map((item: OptionSelect) => ({
                            value: item.pkid,
                            label: item.name,
                          }))}
                          isSearchable={true}
                          isClearable={true}
                          className='basic-single'
                          onChange={(selectedOption: SelectedOption | null) =>
                            handleOnChange(
                              selectedOption?.value || null,
                              'to_warehouse_pkid',
                            )
                          }
                          isDisabled={modalEdit}
                          value={
                            form.to_warehouse_pkid
                              ? {
                                  value: form.to_warehouse_pkid ?? '',
                                  label:
                                    listWarehouse?.find(
                                      (item: OptionSelect) =>
                                        item.pkid === form.to_warehouse_pkid,
                                    )?.name ?? '',
                                }
                              : null
                          }
                          menuPortalTarget={document.body}
                          styles={{
                            control: provided => ({
                              ...provided,
                              borderColor: emptyField.includes(
                                'to_warehouse_pkid',
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
                    <div className='grid grid-cols-2 gap-4'>
                      {form.type && (
                        <div>
                          <label htmlFor='reference_number'>
                            Reference Number{' '}
                            {form.type === 'sales'
                              ? 'Sales Order'
                              : 'Purchase Order'}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          {form.type === 'purchase' ? (
                            <Select
                              id='reference_number'
                              placeholder='Choose Reference Number'
                              options={listPurchaseOrder?.map(
                                (item: OptionSelect) => ({
                                  value: item.pkid,
                                  label: item.code,
                                  code: item.code,
                                }),
                              )}
                              isDisabled={modalEdit}
                              isSearchable={true}
                              isClearable={false}
                              className='basic-single'
                              menuPortalTarget={document.body}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || null,
                                  'reference_number',
                                  selectedOption?.label as string,
                                )
                              }
                              value={
                                form.reference_number
                                  ? {
                                      value: form.reference_number ?? '',
                                      label:
                                        listPurchaseOrder?.find(
                                          (item: OptionSelect) =>
                                            item.code === form.reference_number,
                                        )?.code ?? '',
                                    }
                                  : null
                              }
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes(
                                    'reference_number',
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
                          ) : form.type === 'sales' ? (
                            <Select
                              id='reference_number'
                              placeholder='Choose Reference Number'
                              options={listSalesOrder?.map(
                                (item: OptionSelect) => ({
                                  value: item.pkid,
                                  label: item.code,
                                }),
                              )}
                              isDisabled={modalEdit}
                              isSearchable={true}
                              isClearable={false}
                              className='basic-single'
                              menuPortalTarget={document.body}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || null,
                                  'reference_number',
                                  selectedOption?.label as string,
                                )
                              }
                              value={
                                form.reference_number
                                  ? {
                                      value: form.reference_number ?? '',
                                      label:
                                        listSalesOrder?.find(
                                          (item: OptionSelect) =>
                                            item.code === form.reference_number,
                                        )?.code ?? '',
                                    }
                                  : null
                              }
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes(
                                    'reference_number',
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
                          ) : form.type === 'production' ? (
                            <Select
                              id='reference_number'
                              placeholder='Choose Reference Number'
                              options={listSalesOrder?.map(
                                (item: OptionSelect) => ({
                                  value: item.pkid,
                                  label: item.code,
                                }),
                              )}
                              isSearchable={true}
                              isClearable={true}
                              className='basic-single'
                              menuPortalTarget={document.body}
                              onChange={(
                                selectedOption: SelectedOption | null,
                              ) =>
                                handleOnChange(
                                  selectedOption?.value || null,
                                  'reference_number',
                                )
                              }
                              value={
                                form.reference_number
                                  ? {
                                      value: form.reference_number ?? '',
                                      label:
                                        listSalesOrder?.find(
                                          (item: OptionSelect) =>
                                            item.code === form.reference_number,
                                        )?.code ?? '',
                                    }
                                  : null
                              }
                              styles={{
                                control: provided => ({
                                  ...provided,
                                  borderColor: emptyField.includes(
                                    'reference_number',
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
                          ) : null}
                        </div>
                      )}
                      <div>
                        <label htmlFor='transfer_date'>
                          Transfer Date
                          <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Flatpickr
                          id='transfer_date'
                          name='transfer_date'
                          placeholder='Choose Date'
                          options={{
                            dateFormat: 'Y-m-d',
                            position: isRtl ? 'auto right' : 'auto left',
                          }}
                          className='form-input'
                          onChange={date =>
                            handleOnChange(date[0], 'transfer_date')
                          }
                          value={form.transfer_date || ''}
                          style={{
                            borderColor: emptyField.includes('transfer_date')
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      {form.type === 'sales' && (
                        <div>
                          <label htmlFor='customer_pkid'>Customer</label>
                          <Select
                            id='customer_pkid'
                            placeholder='Choose Customer'
                            options={listCustomer?.map(
                              (item: OptionSelect) => ({
                                value: item.pkid,
                                label: item.name,
                              }),
                            )}
                            isDisabled
                            isSearchable={true}
                            isClearable={false}
                            className='basic-single'
                            menuPortalTarget={document.body}
                            onChange={(selectedOption: SelectedOption | null) =>
                              handleOnChange(
                                selectedOption?.value || null,
                                'customer_pkid',
                              )
                            }
                            value={
                              form.customer_pkid
                                ? {
                                    value: form.customer_pkid ?? '',
                                    label:
                                      listCustomer?.find(
                                        (item: OptionSelect) =>
                                          item.pkid === form.customer_pkid,
                                      )?.name ?? '',
                                  }
                                : null
                            }
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: emptyField.includes(
                                  'customer_pkid',
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
                      )}
                      {form.type === 'purchase' && (
                        <div>
                          <label htmlFor='supplier_pkid'>Supplier</label>
                          <Select
                            id='supplier_pkid'
                            placeholder='Choose Supplier'
                            options={listSupplier?.map(
                              (item: OptionSelect) => ({
                                value: item.pkid,
                                label: item.name,
                              }),
                            )}
                            isDisabled
                            isSearchable={true}
                            isClearable={false}
                            className='basic-single'
                            menuPortalTarget={document.body}
                            onChange={(selectedOption: SelectedOption | null) =>
                              handleOnChange(
                                selectedOption?.value || null,
                                'supplier_pkid',
                              )
                            }
                            value={
                              form.supplier_pkid
                                ? {
                                    value: form.supplier_pkid ?? '',
                                    label:
                                      listSupplier?.find(
                                        (item: OptionSelect) =>
                                          item.pkid === form.supplier_pkid,
                                      )?.name ?? '',
                                  }
                                : null
                            }
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: emptyField.includes(
                                  'supplier_pkid',
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
                      )}
                      {modalEdit && (
                        <div>
                          <label htmlFor='status'>
                            Transfer Status{' '}
                            <span style={{ color: 'red' }}>*</span>
                          </label>
                          <Select
                            id='status'
                            placeholder='Choose Receive Status'
                            options={transferStatus}
                            isSearchable={true}
                            isClearable={true}
                            className='basic-single'
                            onChange={(selectedOption: SelectedOption | null) =>
                              handleOnChange(
                                selectedOption?.value || null,
                                'status',
                              )
                            }
                            isDisabled={!modalEdit}
                            value={
                              form.status
                                ? {
                                    value: form.status ?? '',
                                    label:
                                      transferStatus.find(
                                        (item: { value: string }) =>
                                          item.value === form.status,
                                      )?.label ?? '',
                                  }
                                : null
                            }
                            menuPortalTarget={document.body}
                            styles={{
                              control: provided => ({
                                ...provided,
                                borderColor: emptyField.includes('status')
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
                      )}
                    </div>
                    <div>
                      <label className='flex cursor-pointer items-center'>
                        <span className='text-white-dark mr-2'>
                          Does it has reject item ?
                        </span>
                        <input
                          id='is_rejected'
                          type='checkbox'
                          className='form-checkbox'
                          onChange={e =>
                            handleOnChange(e.target.checked, 'is_rejected')
                          }
                          checked={form.is_rejected || false}
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor='list_item'>List Item</label>
                      <div className='w-full overflow-x-auto overflow-y-auto'>
                        <table className='min-w-full table-auto overflow-hidden rounded-lg'>
                          <thead className='sticky top-0 z-50 bg-white'>
                            <tr>
                              <th className='w-[15%]'>Item Name</th>
                              <th className='w-[15%]'>Total Quantity</th>
                              <th className='w-[15%]'>Accepted Quantity</th>
                              <th className='w-[15%]'>Rejected Quantity</th>
                              <th className='w-[20%]'>Expiry Date</th>
                              <th className='w-[20%]'>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transferDetail.map((item, index) => (
                              <tr className='border' key={index}>
                                <td>
                                  <Select
                                    id={`item_pkid-${index}`}
                                    placeholder='Choose Supplier'
                                    options={listItem?.map(
                                      (item: OptionSelect) => ({
                                        value: item.pkid,
                                        label: item.code,
                                      }),
                                    )}
                                    isDisabled
                                    isSearchable={true}
                                    isClearable={false}
                                    className='basic-single'
                                    onChange={(
                                      selectedOption: SelectedOption | null,
                                    ) =>
                                      handleOnChange(
                                        selectedOption?.value || null,
                                        'item_pkid',
                                      )
                                    }
                                    value={
                                      item.item_pkid
                                        ? {
                                            value: item.item_pkid ?? '',
                                            label:
                                              listItem?.find(
                                                (item_child: OptionSelect) =>
                                                  item_child.pkid ===
                                                  item.item_pkid,
                                              )?.name ?? '',
                                          }
                                        : null
                                    }
                                    styles={{
                                      control: provided => ({
                                        ...provided,
                                        borderColor: emptyField.includes(
                                          'item_pkid',
                                        )
                                          ? 'red'
                                          : '',
                                      }),
                                    }}
                                  />
                                </td>
                                <td>{item.item_quantity}</td>
                                <td>
                                  <input
                                    id={`item_accepted_quantity-${index}`}
                                    name={`item_accepted_quantity-${index}`}
                                    type='text'
                                    placeholder='Nama Aset'
                                    className='form-input'
                                    onChange={e =>
                                      handleOnChangeInventoryTransferDetail(
                                        String(e.target.value),
                                        'item_accepted_quantity',
                                        index,
                                      )
                                    }
                                    disabled={!form.is_rejected}
                                    value={item.item_accepted_quantity || ''}
                                    style={{
                                      borderColor: emptyField.includes('name')
                                        ? 'red'
                                        : '',
                                      cursor: !form.is_rejected
                                        ? 'not-allowed'
                                        : 'pointer',
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    id={`item_rejected_quantity-${index}`}
                                    name={`item_rejected_quantity-${index}`}
                                    type='text'
                                    placeholder='Rejected Quantity'
                                    className='form-input'
                                    onChange={e =>
                                      handleOnChangeInventoryTransferDetail(
                                        String(e.target.value),
                                        'item_rejected_quantity',
                                        index,
                                      )
                                    }
                                    disabled={!form.is_rejected}
                                    value={item.item_rejected_quantity || 0}
                                    style={{
                                      borderColor: emptyField.includes('name')
                                        ? 'red'
                                        : '',
                                      cursor: !form.is_rejected
                                        ? 'not-allowed'
                                        : 'pointer',
                                    }}
                                  />
                                </td>
                                <td>
                                  <Flatpickr
                                    id={`expiry_date-${index}`}
                                    name={`expiry_date-${index}`}
                                    placeholder='Choose Date'
                                    options={{
                                      dateFormat: 'Y-m-d',
                                      position: isRtl
                                        ? 'auto right'
                                        : 'auto left',
                                    }}
                                    className='form-input'
                                    onChange={date =>
                                      handleOnChangeInventoryTransferDetail(
                                        date[0],
                                        'expiry_date',
                                        index,
                                      )
                                    }
                                    style={{
                                      borderColor: emptyField.includes(
                                        'expiry_date',
                                      )
                                        ? 'red'
                                        : '',
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    id={`notes-${index}`}
                                    name={`notes-${index}`}
                                    type='text'
                                    placeholder='Notes'
                                    className='form-input'
                                    onChange={e =>
                                      handleOnChangeInventoryTransferDetail(
                                        String(e.target.value),
                                        'notes',
                                        index,
                                      )
                                    }
                                    value={item.notes || ''}
                                    style={{
                                      borderColor: emptyField.includes('notes')
                                        ? 'red'
                                        : '',
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <label htmlFor='description'>Description</label>
                      <textarea
                        id='description'
                        name='description'
                        rows={3}
                        className='form-textarea'
                        placeholder='Enter Description'
                        onChange={e =>
                          handleOnChange(String(e.target.value), 'description')
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
    </div>
  );
};

export default ModalNewReceiveItem;
