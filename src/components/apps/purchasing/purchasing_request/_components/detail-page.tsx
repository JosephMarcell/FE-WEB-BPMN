import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllCurrency } from '@/app/api/hooks/general_system/currency/useGetAllCurrency';
import {
  approvalStatus,
  priority,
  PurchaseRequestProperty,
} from '@/helpers/utils/purchasing/purchase_request';

import PurchaseRequestDetailDataComponent from './item-purchase-request';

interface IPurchaseRequestProperty {
  data: PurchaseRequestProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  code: string | number;
  number: string | number;
}
const PurchaseRequestDetailComponent = ({ data }: IPurchaseRequestProperty) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listCurrency } = useGetAllCurrency();

  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='currency_code'>
                Currency<span style={{ color: 'red' }}>*</span>
              </label>
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
            <div>
              <label htmlFor='department'>
                Departement <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id='department'
                name='department'
                type='text'
                placeholder='Department Name'
                className='form-input'
                value={data.department || ''}
                disabled
                style={{ cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='priority'>
                Priority Level<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='priority'
                name='priority'
                placeholder='Priority Level'
                className='basic-single'
                options={priority}
                isSearchable={true}
                isClearable={true}
                value={
                  data.priority
                    ? {
                        value: data.priority ?? '',
                        label:
                          priority.find(
                            (item: { label: string }) =>
                              item.label === data.priority,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='requested_date'>
                Request Date <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='requested_date'
                name='requested_date'
                placeholder='Pilih Tanggal'
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
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='approval_status'>
                Approval Status<span style={{ color: 'red' }}>*</span>
              </label>
              <Select
                id='approval_status'
                name='approval_status'
                placeholder='Approval Status'
                className='basic-single'
                options={approvalStatus}
                isSearchable={true}
                isClearable={true}
                value={
                  data.approval_status
                    ? {
                        value: data.approval_status ?? '',
                        label:
                          approvalStatus.find(
                            (item: { label: string }) =>
                              item.label === data.approval_status,
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
              placeholder='Enter Description'
              value={data.description || ''}
              disabled
              style={{ cursor: 'not-allowed' }}
            ></textarea>
          </div>
          <div>
            <div className='w-full text-center text-xl font-bold'>
              List Item
            </div>
          </div>
          {data.purchaseRequestDetails.map((item, index) => (
            <div className='mb-4' key={index}>
              <PurchaseRequestDetailDataComponent
                key={index}
                description={item.description}
                quantity={item.quantity}
                item_pkid={item.item_pkid}
                index={index}
                length={data.purchaseRequestDetails.length}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestDetailComponent;
