import Select from 'react-select';

import { CoaProperty } from '@/helpers/utils/general_ledger/coa';
interface COADetail {
  data: CoaProperty;
}
const COADetailComponent = ({ data }: COADetail) => {
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='name'>
              Nama<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Nama'
              className='form-input'
              value={data.name || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='estimated_life'>
              Perkiraan Umur Manfaat
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='estimated_life'
              name='estimated_life'
              type='text'
              placeholder='Perkiraan Umur Manfaat'
              className='form-input'
              // value={data.estimated_life || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='depreciation_method'>
              Metode Depresiasi
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='depreciation_method'
              name='depreciation_method'
              placeholder='Pilih Metode Depresiasi'
              className='basic-single'
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              // value={
              //   data.depreciation_method
              //     ? {
              //         value: data.depreciation_method ?? '',
              //         label: data.depreciation_method ?? '',
              //       }
              //     : null
              // }
              isDisabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default COADetailComponent;
