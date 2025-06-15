import Select from 'react-select';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { ManProperty } from '@/helpers/utils/manufacturing/man';
interface ManSkillDetail {
  data: ManProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
const ManSkillDetailComponent = ({ data }: ManSkillDetail) => {
  const { data: listAsset } = useGetAllAsset();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='skill'>
              Nama Skill Pekerja<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='skill'
              name='skill'
              type='text'
              placeholder='Nama Skill'
              className='form-input'
              value={data.skill || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='position'>
              Posisi <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='position'
              name='position'
              placeholder='Pilih Metode Depresiasi'
              className='basic-single'
              options={listAsset?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPortalTarget={document.body}
              value={
                data.position
                  ? {
                      value: data.position ?? '',
                      label:
                        listAsset?.find(
                          (item: OptionSelect) => item.pkid === data.position,
                        )?.name ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManSkillDetailComponent;
