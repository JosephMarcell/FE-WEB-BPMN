import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllItem } from '@/app/api/hooks/inventory/items/item/useGetAllItem';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useGetSupplierForDropdown } from '@/app/api/hooks/purchasing/supplier/useGetSupplierForDropdown';
import { useGetCustomerForDropdown } from '@/app/api/hooks/sales/customer/useGetCustomerForDropdown';
import {
  InventoryTransferItemProperty,
  transferStatus,
  transferType,
} from '@/helpers/utils/inventory/inventory_transfer_item';

interface IInventoryTransferItemProperty {
  data: InventoryTransferItemProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
const InventoryReceiveDetailComponent = ({
  data,
}: IInventoryTransferItemProperty) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listSupplier } = useGetSupplierForDropdown();
  const { data: listCustomer } = useGetCustomerForDropdown();
  const { data: listWarehouse } = useGetAllWarehouseByDropdown();
  const { data: listItem } = useGetAllItem();

  return (
    <div className='panel border-white-light h-full px-0'>
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
              value={
                data.type
                  ? {
                      value: data.type ?? '',
                      label:
                        transferType.find(
                          (item: { value: string }) => item.value === data.type,
                        )?.label ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='from_warehouse_pkid'>
                Warehouse (From) <span style={{ color: 'red' }}>*</span>
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
                value={
                  data.from_warehouse_pkid
                    ? {
                        value: data.from_warehouse_pkid ?? '',
                        label:
                          listWarehouse?.find(
                            (item: OptionSelect) =>
                              item.pkid === data.from_warehouse_pkid,
                          )?.name ?? '',
                      }
                    : null
                }
                isDisabled
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
                value={
                  data.to_warehouse_pkid
                    ? {
                        value: data.to_warehouse_pkid ?? '',
                        label:
                          listWarehouse?.find(
                            (item: OptionSelect) =>
                              item.pkid === data.to_warehouse_pkid,
                          )?.name ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {data.type && (
              <div>
                <label htmlFor='reference_number'>
                  Reference Number{' '}
                  {data.type === 'sales' ? 'Sales Order' : 'Purchase Order'}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  id='reference_number'
                  name='reference_number'
                  type='text'
                  placeholder='Nama Aset'
                  className='form-input'
                  disabled
                  value={data.reference_number || ''}
                  style={{ cursor: 'not-allowed' }}
                />
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
                value={data.transfer_date || ''}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {data.type === 'sales' && (
              <div>
                <label htmlFor='customer_pkid'>Customer</label>
                <Select
                  id='customer_pkid'
                  placeholder='Choose Customer'
                  options={listCustomer?.map((item: OptionSelect) => ({
                    value: item.pkid,
                    label: item.name,
                  }))}
                  isDisabled
                  isSearchable={true}
                  isClearable={false}
                  className='basic-single'
                  menuPortalTarget={document.body}
                  value={
                    data.customer_pkid
                      ? {
                          value: data.customer_pkid ?? '',
                          label:
                            listCustomer?.find(
                              (item: OptionSelect) =>
                                item.pkid === data.customer_pkid,
                            )?.name ?? '',
                        }
                      : null
                  }
                />
              </div>
            )}
            {data.type === 'purchase' && (
              <div>
                <label htmlFor='supplier_pkid'>Supplier</label>
                <Select
                  id='supplier_pkid'
                  placeholder='Choose Supplier'
                  options={listSupplier?.map((item: OptionSelect) => ({
                    value: item.pkid,
                    label: item.name,
                  }))}
                  isDisabled
                  isSearchable={true}
                  isClearable={false}
                  className='basic-single'
                  menuPortalTarget={document.body}
                  value={
                    data.supplier_pkid
                      ? {
                          value: data.supplier_pkid ?? '',
                          label:
                            listSupplier?.find(
                              (item: OptionSelect) =>
                                item.pkid === data.supplier_pkid,
                            )?.name ?? '',
                        }
                      : null
                  }
                />
              </div>
            )}
            <div>
              <label htmlFor='status'>
                Transfer Status <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='status'
                placeholder='Choose Receive Status'
                options={transferStatus}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                isDisabled
                value={
                  data.status
                    ? {
                        value: data.status ?? '',
                        label:
                          transferStatus.find(
                            (item: { value: string }) =>
                              item.value === data.status,
                          )?.label ?? '',
                      }
                    : null
                }
              />
            </div>
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
                checked={data.is_rejected || false}
                disabled
                style={{ cursor: 'not-allowed' }}
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
                  {data.transferDetails.map((item, index) => (
                    <tr className='border' key={index}>
                      <td>
                        <Select
                          id={`item_pkid-${index}`}
                          placeholder='Choose Supplier'
                          options={listItem?.map((item: OptionSelect) => ({
                            value: item.pkid,
                            label: item.code,
                          }))}
                          isDisabled
                          isSearchable={true}
                          isClearable={false}
                          className='basic-single'
                          value={
                            item.item_pkid
                              ? {
                                  value: item.item_pkid ?? '',
                                  label:
                                    listItem?.find(
                                      (item_child: OptionSelect) =>
                                        item_child.pkid === item.item_pkid,
                                    )?.name ?? '',
                                }
                              : null
                          }
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
                          disabled
                          style={{ cursor: 'not-allowed' }}
                          value={item.item_accepted_quantity || ''}
                        />
                      </td>
                      <td>
                        <input
                          id={`item_rejected_quantity-${index}`}
                          name={`item_rejected_quantity-${index}`}
                          type='text'
                          placeholder='Rejected Quantity'
                          className='form-input'
                          value={item.item_rejected_quantity || 0}
                          disabled
                          style={{ cursor: 'not-allowed' }}
                        />
                      </td>
                      <td>
                        <Flatpickr
                          id={`expiry_date-${index}`}
                          name={`expiry_date-${index}`}
                          placeholder='Choose Date'
                          options={{
                            dateFormat: 'Y-m-d',
                            position: isRtl ? 'auto right' : 'auto left',
                          }}
                          className='form-input'
                          disabled
                          style={{ cursor: 'not-allowed' }}
                        />
                      </td>
                      <td>
                        <input
                          id={`notes-${index}`}
                          name={`notes-${index}`}
                          type='text'
                          placeholder='Notes'
                          className='form-input'
                          value={item.notes || ''}
                          disabled
                          style={{ cursor: 'not-allowed' }}
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
              value={data.description || ''}
              required
              disabled
              style={{ cursor: 'not-allowed' }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReceiveDetailComponent;
