import Select from 'react-select';

import { useGetAllAsset } from '@/app/api/hooks/fixed_asset/asset_list/useGetAllAsset';
import { useGetAllWorkCentre } from '@/app/api/hooks/manufacturing/work_centre/useGetAllWorkCentre';
import { MachineProperty } from '@/helpers/utils/manufacturing/machine';
interface WorkCentreDetail {
  data: MachineProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
}
const MachineDetailComponent = ({ data }: WorkCentreDetail) => {
  const { data: listAsset } = useGetAllAsset();
  const { data: listWorkCentre } = useGetAllWorkCentre();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
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
            <label htmlFor='work_centre_pkid'>
              Work Centre
              <span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='work_centre_pkid'
              name='work_centre_pkid'
              placeholder='Pilih Metode Depresiasi'
              className='basic-single'
              options={listWorkCentre?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.work_centre_pkid
                  ? {
                      value: data.work_centre_pkid ?? '',
                      label:
                        listWorkCentre?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.work_centre_pkid,
                        )?.name ?? '',
                    }
                  : null
              }
              isDisabled
            />
          </div>
          <div>
            <label className='mt-1 flex cursor-pointer items-center'>
              <span className='text-white-dark mr-2'>
                Apakah ingin Custom Biaya ?{' '}
              </span>
              <input type='checkbox' className='form-checkbox' disabled />
            </label>
          </div>
          <div>
            <label htmlFor='actual_hours_per_day'>
              Biaya Per Jam
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='cost_per_hour'
              name='cost_per_hour'
              type='text'
              disabled
              placeholder='Waktu penggunaan aset (jam)'
              className='form-input'
              value={data.cost_per_hour || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailComponent;
