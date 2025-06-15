import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import { useGetCustomerForDropdown } from '@/app/api/hooks/sales/customer/useGetCustomerForDropdown';
import {
  deliveryStatus,
  orderStatus,
  paymentStatus,
} from '@/helpers/utils/purchasing/purchase_order';
import { SalesOrderProperty } from '@/helpers/utils/sales/sales';

import SalesOrderDetailDataComponent from './item-sales-order';

interface ISalesOrderProperty {
  data: SalesOrderProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
const SalesOrderDetailComponent = ({ data }: ISalesOrderProperty) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listCurrency } = useGetAllCurrency();
  const { data: listCustomer } = useGetCustomerForDropdown();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='customer_id'>Customer Name</label>
              <Select
                id='customer_id'
                name='customer_id'
                placeholder='Customer Name'
                className='basic-single'
                options={listCustomer?.map((item: OptionSelect) => ({
                  value: item.pkid,
                  label: item.name,
                }))}
                menuPortalTarget={document.body}
                isSearchable={true}
                isClearable={true}
                value={
                  data.customer_id
                    ? {
                        value: data.customer_id ?? '',
                        label:
                          listCustomer?.find(
                            (item: OptionSelect) =>
                              item.pkid === data.customer_id,
                          )?.name ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='currency_code'>Currency</label>
              <Select
                id='currency_code'
                name='currency_code'
                placeholder='Currency Code'
                className='basic-single'
                options={listCurrency?.map((item: OptionSelect) => ({
                  value: item.code,
                  label: item.name,
                }))}
                isSearchable={true}
                isClearable={true}
                value={
                  data.currency_code
                    ? {
                        value: data.currency_code ?? '',
                        label:
                          listCurrency?.find(
                            (item: OptionSelect) =>
                              item.code === data.currency_code,
                          )?.name ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='order_date'>Order Date</label>
              <Flatpickr
                id='order_date'
                name='order_date'
                placeholder='Pilih Tanggal'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.order_date || ''}
              />
            </div>
            <div>
              <label htmlFor='delivery_date'>Deliver Date</label>
              <Flatpickr
                id='delivery_date'
                name='delivery_date'
                placeholder='Pilih Tanggal'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.delivery_date || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='status'>Order Status</label>
              <Select
                id='status'
                name='status'
                placeholder='Choose Order Status'
                className='basic-single'
                options={orderStatus}
                isSearchable={true}
                isClearable={true}
                maxMenuHeight={150}
                menuPlacement='top'
                value={
                  data.status
                    ? {
                        value: data.status ?? '',
                        label:
                          orderStatus.find(
                            (item: { label: string }) =>
                              item.label === data.status,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='delivery_status'>Deliver Status</label>
              <Select
                id='delivery_status'
                name='delivery_status'
                placeholder='Choose Deliver Status'
                className='basic-single'
                options={deliveryStatus}
                isSearchable={true}
                isClearable={true}
                maxMenuHeight={150}
                menuPlacement='top'
                value={
                  data.delivery_status
                    ? {
                        value: data.delivery_status ?? '',
                        label:
                          deliveryStatus.find(
                            (item: { label: string }) =>
                              item.label === data.delivery_status,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='payment_status'>Payment Status</label>
              <Select
                id='payment_status'
                name='payment_status'
                placeholder='Choose Payment Status'
                className='basic-single'
                options={paymentStatus}
                isSearchable={true}
                isClearable={true}
                maxMenuHeight={150}
                menuPlacement='top'
                value={
                  data.payment_status
                    ? {
                        value: data.payment_status ?? '',
                        label:
                          paymentStatus.find(
                            (item: { label: string }) =>
                              item.label === data.payment_status,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
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
            ></textarea>
          </div>

          {data.salesOrderDetails.map((item, index) => (
            <div className='mb-4' key={index}>
              <SalesOrderDetailDataComponent
                key={index}
                description={item.description}
                quantity={item.quantity}
                item_pkid={item.item_pkid}
                index={index}
                length={data.salesOrderDetails.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetailComponent;
