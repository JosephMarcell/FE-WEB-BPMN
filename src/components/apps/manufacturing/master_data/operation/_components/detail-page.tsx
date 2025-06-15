import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';
import Select from 'react-select';

import { IRootState } from '@/store';

import { useGetAllItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
import { useGetAllMachine } from '@/app/api/hooks/manufacturing/machine/useGetAllMachine';
import { useGetAllMan } from '@/app/api/hooks/manufacturing/man/useGetAllMan';
import { useGetAllWorkCentre } from '@/app/api/hooks/manufacturing/work_centre/useGetAllWorkCentre';
import { OperationProperty } from '@/helpers/utils/manufacturing/operation';

interface OperationDetail {
  data: OperationProperty;
}
interface OptionSelect {
  pkid: string | number;
  name: string | number;
  description?: string | number;
  skill?: string | number;
}
const OperationDetailComponent = ({ data }: OperationDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const { data: listItem } = useGetAllItems();
  const { data: listManSkill } = useGetAllMan();
  const { data: listMachine } = useGetAllMachine();
  const { data: listWorkCentre } = useGetAllWorkCentre();
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='name'>
              Nama Operasi<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Nama Operasi'
              className='form-input'
              value={data.name || ''}
            />
          </div>
          <div>
            <label htmlFor='item_pkid'>
              Pilih Item<span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='item_pkid'
              name='item_pkid'
              placeholder='Pilih Item'
              className='basic-single'
              options={listItem?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.name,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.item_pkid
                  ? {
                      value: data.item_pkid ?? '',
                      label:
                        listItem?.find(
                          (item: OptionSelect) => item.pkid === data.item_pkid,
                        )?.name ?? '',
                    }
                  : null
              }
            />
          </div>
          <div>
            <label htmlFor='description'>
              Deskripsi<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='description'
              name='description'
              type='text'
              placeholder='Lokasi Work Centre'
              className='form-input'
              value={data.description || ''}
            />
          </div>
          <div>
            <label htmlFor='item_max'>
              Banyak Item per Produksi
              <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='item_max'
              name='item_max'
              type='text'
              placeholder='Lokasi Work Centre'
              className='form-input'
              value={data.item_max || ''}
            />
          </div>
          <div>
            <label htmlFor='work_centre_pkid'>
              Pilih Work Centre<span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='work_centre_pkid'
              name='work_centre_pkid'
              placeholder='Pilih Work Centre'
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
            />
          </div>
          <div>
            <label htmlFor='machine_pkid'>
              Pilih Mesin<span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='machine_pkid'
              name='machine_pkid'
              placeholder='Pilih Mesin'
              className='basic-single'
              options={listMachine?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item?.description ?? '',
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.machine_pkid
                  ? {
                      value: data.machine_pkid ?? '',
                      label:
                        listMachine?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.machine_pkid,
                        )?.description ?? '',
                    }
                  : null
              }
            />
          </div>
          <div>
            <label htmlFor='man_skill_pkid'>
              Pilih Man Skill<span style={{ color: 'red' }}>*</span>
            </label>
            <Select
              id='man_skill_pkid'
              name='man_skill_pkid'
              placeholder='Pilih Item'
              className='basic-single'
              options={listManSkill?.map((item: OptionSelect) => ({
                value: item.pkid,
                label: item.skill,
              }))}
              isSearchable={true}
              isClearable={true}
              maxMenuHeight={150}
              menuPlacement='top'
              value={
                data.man_skill_pkid
                  ? {
                      value: data.man_skill_pkid ?? '',
                      label:
                        listManSkill?.find(
                          (item: OptionSelect) =>
                            item.pkid === data.man_skill_pkid,
                        )?.skill ?? '',
                    }
                  : null
              }
            />
          </div>
          <div>
            <label htmlFor='machine_hour'>
              Lama Produksi<span style={{ color: 'red' }}>*</span>
            </label>

            <Flatpickr
              placeholder='Pilih Waktu'
              options={{
                noCalendar: true,
                enableTime: true,
                dateFormat: 'H:i:S',
                time_24hr: true,
                position: isRtl ? 'auto right' : 'auto left',
              }}
              value={data.machine_hour || ''}
              className='form-input'
            />
          </div>
          <div>
            <label htmlFor='man_skill_quantity'>
              Banyak Pekerja<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id='man_skill_quantity'
              name='man_skill_quantity'
              type='text'
              placeholder='Jumlah Pekerja'
              className='form-input'
              value={data.man_skill_quantity || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationDetailComponent;
