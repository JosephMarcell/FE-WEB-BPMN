import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllItem } from '@/app/api/hooks/inventory/items/item/useGetAllItem';
import { useGetAllWarehouseByDropdown } from '@/app/api/hooks/inventory/master_data/warehouse/useGetAllWarehouseByDropdown';
import { useGetSupplierForDropdown } from '@/app/api/hooks/purchasing/supplier/useGetSupplierForDropdown';
import { useGetCustomerForDropdown } from '@/app/api/hooks/sales/customer/useGetCustomerForDropdown';
import {
  InventoryReceiveItemProperty,
  receiveStatus,
  receiveType,
} from '@/helpers/utils/inventory/inventory_receive_item';

interface IInventoryReceiveItemProperty {
  data: InventoryReceiveItemProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
const InventoryReceiveDetailComponent = ({
  data,
}: IInventoryReceiveItemProperty) => {
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
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='type'>
                Receive Type <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='type'
                placeholder='Choose Receive Type'
                options={receiveType}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                isDisabled
                value={
                  data.type
                    ? {
                        value: data.type ?? '',
                        label:
                          receiveType.find(
                            (item: { value: string }) =>
                              item.value === data.type,
                          )?.label ?? '',
                      }
                    : null
                }
                styles={{
                  control: provided => ({
                    ...provided,
                    zIndex: 9999,
                    cursor: 'not-allowed',
                  }),
                }}
              />
            </div>
            <div>
              <label htmlFor='warehouse_pkid'>
                Warehouses <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='warehouse_pkid'
                placeholder='Choose Warehouse'
                options={listWarehouse?.map((item: OptionSelect) => ({
                  value: item.pkid,
                  label: item.name,
                }))}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                isDisabled
                value={
                  data.warehouse_pkid
                    ? {
                        value: data.warehouse_pkid ?? '',
                        label:
                          listWarehouse?.find(
                            (item: OptionSelect) =>
                              item.pkid === data.warehouse_pkid,
                          )?.name ?? '',
                      }
                    : null
                }
                menuPortalTarget={document.body}
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
              <label htmlFor='received_date'>
                Received Date
                <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='received_date'
                name='received_date'
                placeholder='Choose Date'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                disabled
                className='form-input'
                value={data.received_date || ''}
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
                Receive Status <span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='status'
                placeholder='Choose Receive Status'
                options={receiveStatus}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                isDisabled
                value={
                  data.status
                    ? {
                        value: data.status ?? '',
                        label:
                          receiveStatus.find(
                            (item: { value: string }) =>
                              item.value === data.status,
                          )?.label ?? '',
                      }
                    : null
                }
                menuPortalTarget={document.body}
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
                  {data.receiveDetails.map((item, index) => (
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
                          styles={{
                            control: provided => ({
                              ...provided,
                              zIndex: 9999,
                              cursor: 'not-allowed',
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
                          disabled={!data.is_rejected}
                          value={item.item_accepted_quantity || ''}
                          style={{ cursor: 'not-allowed' }}
                        />
                      </td>
                      <td>
                        <input
                          id={`item_rejected_quantity-${index}`}
                          name={`item_rejected_quantity-${index}`}
                          type='text'
                          placeholder='Rejected Quantity'
                          className='form-input'
                          disabled={!data.is_rejected}
                          value={item.item_rejected_quantity || 0}
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
                          disabled
                          className='form-input'
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
                          disabled
                          value={item.notes || ''}
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
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReceiveDetailComponent;
