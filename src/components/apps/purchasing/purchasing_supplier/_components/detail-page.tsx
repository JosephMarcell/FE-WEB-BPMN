import Select from 'react-select';
import MaskedInput from 'react-text-mask';

import { useGetAllCityByProvince } from '@/app/api/hooks/general_system/location/useGetAllCityByProvince';
import { useGetAllCountry } from '@/app/api/hooks/general_system/location/useGetAllCountry';
import { useGetAllProvinceInIndonesia } from '@/app/api/hooks/general_system/location/useGetAllProvinceInIndonesia';
import {
  businessType,
  paymentTerms,
  SupplierProperty,
} from '@/helpers/utils/purchasing/supplier';

interface ISupplierProperty {
  data: SupplierProperty;
}

const SupplierDetailComponent = ({ data }: ISupplierProperty) => {
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
              <label htmlFor='name'>Supplier Name</label>
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
                disabled
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
                disabled
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
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='business_type'>Business Type</label>
              <Select
                id='business_type'
                placeholder='Choose Business Type'
                options={businessType}
                isSearchable={true}
                isClearable={true}
                className='basic-single'
                menuPortalTarget={document.body}
                value={
                  data.business_type
                    ? {
                        value: data.business_type ?? '',
                        label:
                          businessType.find(
                            (item: { label: string }) =>
                              item.label === data.business_type,
                          )?.label ?? '',
                      }
                    : null
                }
                isDisabled
              />
            </div>
            <div>
              <label htmlFor='bank_account'>Bank Account</label>
              <input
                id='bank_account'
                name='bank_account'
                type='text'
                placeholder='Nama Kategory'
                className='form-input'
                value={data.bank_account || ''}
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
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
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
            <div>
              <label htmlFor='contact_person'>Contact Person</label>
              <input
                id='contact_person'
                name='contact_person'
                type='text'
                placeholder='Contact Name'
                className='form-input'
                value={data.contact_person || ''}
                disabled
              />
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

export default SupplierDetailComponent;
