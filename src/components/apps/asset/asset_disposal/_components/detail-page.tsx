import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

// import { useGetAllFacility } from '@/app/api/hooks/fixed_asset/facility/useGetAllFacility';
import { AssetDisposalProperty } from '@/helpers/utils/fixed_asset/asset_disposal';
interface IAssetDisposalDetail {
  data: AssetDisposalProperty;
}
// interface OptionSelect {
//   pkid: string | number;
//   name: string | number;
// }
const AssetDisposalDetailComponent = ({ data }: IAssetDisposalDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  // const { data: listAsset } = useGetAllFacility();

  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='title'>Judul Disposal</label>
            <input
              id='title'
              name='title'
              type='text'
              placeholder='Nama Kategory'
              className='form-input'
              disabled
              value={data.title || ''}
            />
          </div>
          <div>
            <label htmlFor='disposal_reason'>Alasan Disposal</label>
            <input
              id='disposal_reason'
              name='disposal_reason'
              type='text'
              placeholder='Alasan Disposal'
              className='form-input'
              disabled
              value={data.disposal_reason || ''}
            />
          </div>
          <div>
            <label htmlFor='disposal_method'>Metode Disposal</label>
            <input
              id='disposal_method'
              name='disposal_method'
              type='text'
              placeholder='Alasan Disposal'
              className='form-input'
              disabled
              value={data.disposal_method || ''}
            />
          </div>
          <div>
            <label htmlFor='disposal_date'>Tanggal Disposal Aset</label>
            <Flatpickr
              id='disposal_date'
              name='disposal_date'
              placeholder='Pilih Tanggal'
              options={{
                dateFormat: 'Y-m-d',
                position: isRtl ? 'auto right' : 'auto left',
              }}
              className='form-input'
              disabled
              value={data.disposal_date || ''}
            />
          </div>
          <div>
            <label htmlFor='asset_pkid'>Nama Aset</label>
            <Select
              id='asset_pkid'
              name='asset_pkid'
              placeholder='Pilih Metode Depresiasi'
              className='basic-single'
              // options={listAsset?.map((item: OptionSelect) => ({
              //   value: item.pkid,
              //   label: item.name,
              // }))}
              isSearchable={true}
              isClearable={true}
              isDisabled
              maxMenuHeight={150}
              menuPlacement='top'
              // value={
              //   data.asset_pkid
              //     ? {
              //         value: data.asset_pkid ?? '',
              //         label:
              //           listAsset?.find(
              //             (item: OptionSelect) => item.pkid === data.asset_pkid,
              //           )?.name ?? '',
              //       }
              //     : null
              // }
            />
          </div>
          <div>
            <label htmlFor='description'>Deskripsi Disposal</label>
            <textarea
              id='description'
              name='description'
              rows={3}
              className='form-textarea'
              disabled
              placeholder='Enter Address'
              value={data.description || ''}
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDisposalDetailComponent;
