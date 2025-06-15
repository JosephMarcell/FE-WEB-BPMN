import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { AssetStockTakeProperty } from '@/helpers/utils/fixed_asset/asset_stock_take';
interface IAssetStockTakeDetail {
  data: AssetStockTakeProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
const AssetStockTakeDetailComponent = ({ data }: IAssetStockTakeDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='title'>
              Judul Maintenance <span style={{ color: 'red' }}>*</span>
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
              placeholder='Pilih Metode Depresiasi'
              className='basic-single'
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
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

          <div>
            <label htmlFor='stock_take_by'>
              Nama Penilai Aset <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='stock_take_by'
              name='stock_take_by'
              type='text'
              placeholder='Nama Kategory'
              className='form-input'
              value={data.stock_take_by || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='condition_of_assets'>
              Kondisi Aset <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='condition_of_assets'
              name='condition_of_assets'
              type='text'
              placeholder='Nama Kategory'
              className='form-input'
              value={data.condition_of_assets || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='stock_take_date'>
              Tanggal Stock Take Aset <span style={{ color: 'red' }}>*</span>
            </label>
            <Flatpickr
              id='stock_take_date'
              name='stock_take_date'
              placeholder='Pilih Tanggal'
              options={{
                dateFormat: 'Y-m-d',
                position: isRtl ? 'auto right' : 'auto left',
              }}
              className='form-input'
              value={data.stock_take_date || ''}
              disabled
            />
          </div>

          <div>
            <label htmlFor='description'>
              Deskripsi Stock Take <span style={{ color: 'red' }}>*</span>
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

export default AssetStockTakeDetailComponent;
