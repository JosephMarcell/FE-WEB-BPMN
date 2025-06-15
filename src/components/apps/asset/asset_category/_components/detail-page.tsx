import { AssetCategoryProperty } from '@/helpers/utils/fixed_asset/asset_category';

interface IAssetCategoryDetail {
  data: AssetCategoryProperty;
}

const AssetCategoryDetailComponent = ({ data }: IAssetCategoryDetail) => {
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='mb-5 flex flex-col gap-5 px-5 md:flex-row md:items-center'>
        <div className='w-full'>
          <label htmlFor='name'>
            Nama Kategori<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            id='name'
            name='name'
            type='text'
            placeholder='Nama Kategory'
            className='form-input w-full'
            value={data.name ?? ''}
            disabled
            style={{ cursor: 'not-allowed' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetCategoryDetailComponent;
