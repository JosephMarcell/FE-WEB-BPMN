import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { AssetTransferProperty } from '@/helpers/utils/fixed_asset/asset_transfer';
interface IAssetTransferDetail {
  data: AssetTransferProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
const AssetTransferDetailComponent = ({ data }: IAssetTransferDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='title'>
              Judul Transfer<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='title'
              name='title'
              type='text'
              placeholder='Nama Kategory'
              className='form-input'
              value={data.title || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='asset_pkid'>
              Nama Aset
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='asset_pkid'
              name='asset_pkid'
              placeholder='Pilih Aset'
              className='basic-single'
              options={listAsset?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              value={
                data.asset_pkid
                  ? {
                      value: data.asset_pkid ?? '',
                      label:
                        listAsset?.find(
                          (item: OptionSelect) => item.pkid === data.asset_pkid,
                        )?.name ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='new_address'>
                Alamat Baru Aset<span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                id='new_address'
                name='new_address'
                placeholder='Alasan Disposal'
                className='form-input'
                rows={3}
                value={data.new_address || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='new_department'>
                Departemen Baru Aset
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id='new_department'
                name='new_department'
                type='text'
                placeholder='Alasan Disposal'
                className='form-input'
                value={data.new_department || ''}
                disabled
              />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='transfer_method'>
                Metode Transfer Aset
                <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id='transfer_method'
                name='transfer_method'
                type='text'
                placeholder='Alasan Disposal'
                className='form-input'
                value={data.transfer_method || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='transfer_date'>
                Tanggal Disposal Aset <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='transfer_date'
                name='transfer_date'
                placeholder='Pilih Tanggal'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.transfer_date || ''}
                disabled
              />
            </div>
          </div>
          <div>
            <label htmlFor='transfer_cost'>
              Biaya Transfe Aset
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='transfer_cost'
              name='transfer_cost'
              type='text'
              placeholder='Alasan Disposal'
              className='form-input'
              value={data.transfer_cost || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='quantity'>
              Jumlah Aset yang Pindah
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='quantity'
              name='quantity'
              type='text'
              placeholder='Alasan Disposal'
              className='form-input'
              value={data.quantity || ''}
              disabled
            />
          </div>

          <div>
            <label htmlFor='description'>
              Deskripsi Disposal <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              id='description'
              name='description'
              rows={3}
              className='form-textarea'
              placeholder='Enter Address'
              value={data.description || ''}
              disabled
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTransferDetailComponent;
