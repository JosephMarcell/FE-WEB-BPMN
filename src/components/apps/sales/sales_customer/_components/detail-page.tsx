import Select from 'react-select';
import MaskedInput from 'react-text-mask';

import { useGetAllCityByProvince } from '@/app/api/hooks/general_system/location/useGetAllCityByProvince';
import { useGetAllCountry } from '@/app/api/hooks/general_system/location/useGetAllCountry';
import { useGetAllProvinceInIndonesia } from '@/app/api/hooks/general_system/location/useGetAllProvinceInIndonesia';
import {
  CustomerProperty,
  customerTypes,
  paymentTerms,
} from '@/helpers/utils/sales/customer';

interface ICustomerProperty {
  data: CustomerProperty;
}

const CustomerDetailComponent = ({ data }: ICustomerProperty) => {
  const { data: listCountry } = useGetAllCountry();
  const { data: listProvinceInIndonesia } = useGetAllProvinceInIndonesia();
  const { data: listCityByProvince } = useGetAllCityByProvince(
    Number(data.city),
  );
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='name'>Customer Name</label>
              <input
                id='name'
                name='name'
                type='text'
                placeholder='Supplier Name'
                className='form-input'
                value={data.name || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='contact_number'>Contact Number</label>
              <input
                id='contact_number'
                name='contact_number'
                type='text'
                placeholder='Contact Number'
                className='form-input'
                value={data.contact_number || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='npwp'>NPWP</label>
              <MaskedInput
                id='npwp'
                name='npwp'
                type='text'
                placeholder='NPWP (##.###.###.#-###.###)'
                className='form-input'
                mask={[
                  /\d/,
                  /\d/,
                  '.',
                  /\d/,
                  /\d/,
                  /\d/,
                  '.',
                  /\d/,
                  /\d/,
                  /\d/,
                  '.',
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  '.',
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                value={data.npwp || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='text'
                placeholder='email ex : achmad@gmail.com'
                className='form-input'
                value={data.email || ''}
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='postal_code'>Postal Code</label>
              <input
                id='postal_code'
                name='postal_code'
                type='text'
                placeholder='ex : (08123)'
                className='form-input'
                value={data.postal_code || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='website'>Website</label>
              <input
                id='website'
                name='website'
                type='text'
                placeholder='ex : https://google.com'
                className='form-input'
                value={data.website || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='customer_type'>Customer Type</label>
              <Select
                id='Customer_type'
                placeholder='Choose Business Type'
                options={customerTypes}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                menuPortalTarget={document.body}
                value={
                  data.customer_type
                    ? {
                        value: data.customer_type ?? '',
                        label:
                          customerTypes.find(
                            (item: { label: string }) =>
                              item.label === data.customer_type,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='payment_terms'>Payment Terms</label>
              <Select
                id='payment_terms'
                placeholder='Choose Payment Terms'
                options={paymentTerms}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                value={
                  data.payment_terms
                    ? {
                        value: data.payment_terms ?? '',
                        label:
                          paymentTerms.find(
                            (item: { label: string }) =>
                              item.label === data.payment_terms,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='fax_number'>Fax Number</label>
              <input
                id='fax_number'
                name='fax_number'
                type='text'
                placeholder='Fax Number'
                className='form-input'
                value={data.fax_number || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='industry Name'>Industry</label>
              <input
                id='industry'
                name='industry'
                type='text'
                placeholder='Industry'
                className='form-input'
                value={data.industry || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='account_manager'>Account Manager</label>
              <input
                id='account_manager'
                name='account_manager'
                type='text'
                placeholder='Account Manager'
                className='form-input'
                value={data.account_manager || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='company'>Company</label>
              <input
                id='company'
                name='company'
                type='text'
                placeholder='Company Name'
                className='form-input'
                value={data.company || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label htmlFor='country'>Country</label>
              <Select
                id='country'
                placeholder='Choose Country'
                name='country'
                className='basic-single'
                options={listCountry?.map((item: { country: string }) => ({
                  value: item.country,
                  label: item.country,
                }))}
                isSearchable={true}
                isClearable={true}
                value={
                  data.country
                    ? {
                        value: data.country ?? '',
                        label:
                          listCountry?.find(
                            (item: { country: string }) =>
                              item.country === data.country,
                          )?.country ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='state'>Province</label>
              {data.country === 'Indonesia' ? (
                <Select
                  id='state'
                  placeholder='Choose Province'
                  name='state'
                  className='basic-single'
                  options={listProvinceInIndonesia?.map(
                    (item: {
                      nama_provinsi: string;
                      kode_provinsi: number;
                    }) => ({
                      value: item.nama_provinsi,
                      label: item.nama_provinsi,
                      provinceCode: item.kode_provinsi,
                    }),
                  )}
                  isSearchable={true}
                  isClearable={true}
                  value={
                    data.state
                      ? {
                          value: data.state ?? '',
                          label:
                            listProvinceInIndonesia?.find(
                              (item: { nama_provinsi: string }) =>
                                item.nama_provinsi == data.state,
                            )?.nama_provinsi ?? '',
                        }
                      : null
                  }
                  isDisabled
                />
              ) : (
                <input
                  id='state'
                  name='state'
                  type='text'
                  placeholder='Province Name'
                  className='form-input'
                  value={data.state || ''}
                  disabled
                />
              )}
            </div>
            <div>
              <label htmlFor='city'>City</label>
              {data.country === 'Indonesia' ? (
                <Select
                  id='city'
                  placeholder='Choose City'
                  name='city'
                  className='basic-single'
                  options={listCityByProvince?.map(
                    (item: { nama_kota: string }) => ({
                      value: item.nama_kota,
                      label: item.nama_kota,
                    }),
                  )}
                  isSearchable={true}
                  isClearable={true}
                  value={
                    data.city
                      ? {
                          value: data.city ?? '',
                          label:
                            listCityByProvince?.find(
                              (item: { nama_kota: string }) =>
                                item.nama_kota === data.city,
                            )?.nama_kota ?? '',
                        }
                      : null
                  }
                  isDisabled
                />
              ) : (
                <input
                  id='city'
                  name='city'
                  type='text'
                  placeholder='City Name'
                  className='form-input'
                  value={data.city || ''}
                  disabled
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <textarea
              id='address'
              name='address'
              placeholder='Supplier Address'
              className='form-input'
              value={data.address || ''}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailComponent;
