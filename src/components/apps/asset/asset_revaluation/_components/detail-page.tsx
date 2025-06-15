import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { AssetRevaluationProperty } from '@/helpers/utils/fixed_asset/asset_revaluation';
interface IAssetRevaluationDetail {
  data: AssetRevaluationProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
const AssetRevaluationDetailComponent = ({ data }: IAssetRevaluationDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listAsset } = useGetAllAsset();

  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='title'>
              Judul Revaluasi <span style={{ color: 'red' }}>*</span>
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
              options={listAsset?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              isDisabled
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
            />
          </div>

          <div>
            <label htmlFor='revaluation_amount'>
              Jumlah Nilai Revaluasi <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='revaluation_amount'
              name='revaluation_amount'
              type='text'
              placeholder='Nama Kategory'
              className='form-input'
              value={data.revaluation_amount || ''}
              disabled
            />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='revaluation_date'>
                Tanggal Revaluasi Aset <span style={{ color: 'red' }}>*</span>
              </label>
              <Flatpickr
                id='revaluation_date'
                name='revaluation_date'
                placeholder='Pilih Tanggal'
                options={{
                  dateFormat: 'Y-m-d',
                  position: isRtl ? 'auto right' : 'auto left',
                }}
                className='form-input'
                value={data.revaluation_date || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor='revaluation_year'>
                Tahun Umur Manfaat baru <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id='revaluation_year'
                name='revaluation_year'
                type='text'
                placeholder='Nama Kategory'
                className='form-input'
                value={data.revaluation_year || ''}
                disabled
              />
            </div>
          </div>

          <div>
            <label htmlFor='description'>
              Deskripsi Revaluasi <span style={{ color: 'red' }}>*</span>
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
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetRevaluationDetailComponent;
