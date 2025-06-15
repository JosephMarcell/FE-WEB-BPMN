import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetPurchaseRequestForDropwdown } from '@/app/api/hooks/purchasing/purchase_request/useGetPurchaseRequestForDropwdown';
import { useGetSupplierForDropdown } from '@/app/api/hooks/purchasing/supplier/useGetSupplierForDropdown';
import {
  deliveryStatus,
  orderStatus,
  paymentStatus,
  PurchaseOrderProperty,
} from '@/helpers/utils/purchasing/purchase_order';

import PurchaseOrderDetailDataComponent from './item-purchase-order';

interface IPurchaseOrderProperty {
  data: PurchaseOrderProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
const PurchaseOrderDetailComponent = ({ data }: IPurchaseOrderProperty) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listSupplier } = useGetSupplierForDropdown();
  const { data: listPurchaseRequest } = useGetPurchaseRequestForDropwdown();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='purchase_request_id'>
              Purchase Order Code
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='purchase_request_id'
              name='purchase_request_id'
              placeholder='Choose Purchase Request'
              className='basic-single'
              options={listPurchaseRequest?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.code,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.purchase_request_id
                  ? {
                      value: data.purchase_request_id ?? '',
                      label:
                        listPurchaseRequest?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.purchase_request_id,
                        )?.code ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
          <div>
            <label htmlFor='supplier_id'>
              Supplir Name
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='supplier_id'
              name='supplier_id'
              placeholder='Choose Supplier'
              className='basic-single'
              options={listSupplier?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.supplier_id
                  ? {
                      value: data.supplier_id ?? '',
                      label:
                        listSupplier?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.supplier_id,
                        )?.name ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='requested_date'>
                Request Date <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='requested_date'
                name='requested_date'
                placeholder='Choose Date'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.requested_date || ''}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div>
              <label htmlFor='order_date'>
                Order Date <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='order_date'
                name='order_date'
                placeholder='Choose Date'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.order_date || ''}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
            <div>
              <label htmlFor='delivery_date'>
                Delivery Date <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='delivery_date'
                name='delivery_date'
                placeholder='Choose Date'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.delivery_date || ''}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='status'>
                Order Status
                <span style={{ color: 'red' }}>*</span>
              </label>
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
              <label htmlFor='delivery_status'>
                Delivery Status
                <span style={{ color: 'red' }}>*</span>
              </label>
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
              <label htmlFor='payment_status'>
                Payment Status
                <span style={{ color: 'red' }}>*</span>
              </label>
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
            <label htmlFor='description'>
              Description <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              id='description'
              name='description'
              rows={3}
              className='form-textarea'
              placeholder='Enter Address'
              value={data.description || ''}
              required
              disabled
              style={{ cursor: 'not-allowed' }}
            ></textarea>
          </div>
          {data.purchaseOrderDetails.map((item, index) => (
            <div className='mb-4' key={index}>
              <PurchaseOrderDetailDataComponent
                key={index}
                description={item.description}
                quantity={item.quantity}
                item_pkid={item.item_pkid}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailComponent;
