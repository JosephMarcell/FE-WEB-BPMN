function formatFacilityLastUsage(dateString: string) {
  const [datePart, fullTimePart] = dateString.split('T');

  const [year, month, day] = datePart.split('-');

  const [timePart] = fullTimePart.split('+');

  const [hour, minute, second] = timePart.split(':');

  const formattedSecond = second.slice(0, 2);

  return `${day}-${month}-${year} ${hour}:${minute}:${formattedSecond}`;
}

import { useState } from 'react';
import Flatpickr from 'react-flatpickr';

import { getTranslation } from '@/lib/lang/i18n';

import { FacilityProperty } from '@/helpers/utils/fixed_asset/facility';
import { AssetCondition, AssetStatus } from '@/helpers/utils/global/listStatus';

const { t } = getTranslation();
interface IFacilityDetail {
  data: FacilityProperty;
}

const FacilityDetailComponent = ({ data }: IFacilityDetail) => {
  const [form] = useState({
    pkid: data?.pkid || '',
    facility_name: data?.facility_name || '',
    facility_lat: data?.facility_lat || '',
    facility_long: data?.facility_long || '',
    last_usage: data?.last_usage
      ? formatFacilityLastUsage(String(data.last_usage))
      : '',
    condition: data?.condition || '',
    status: data?.status || '',
    description: data?.description || '',
  });
  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div>
            <label htmlFor='pkid'>{t('facility_id')}</label>
            <input
              id='pkid'
              name='pkid'
              type='text'
              className='form-input'
              value={form.pkid || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='facility_name'>{t('facility_name')}</label>
            <input
              id='facility_name'
              name='facility_name'
              type='text'
              className='form-input'
              value={form.facility_name || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='facility_lat'>{t('facility_latitude')}</label>
            <input
              id='facility_lat'
              name='facility_lat'
              type='number'
              className='form-input'
              value={form.facility_lat || ''}
              disabled
            />
          </div>
          <div>
            <label htmlFor='facility_long'>{t('facility_longitude')}</label>
            <input
              id='facility_long'
              name='facility_long'
              type='text'
              className='form-input'
              value={form.facility_long || ''}
              disabled
            />
          </div>

          <label htmlFor='last_usage'>
            {t('last_usage')} DD-MM-YYYY HH:MM:SS
          </label>
          <Flatpickr
            id='last_usage'
            name='last_usage'
            placeholder={t('Pilih Tanggal')}
            options={{
              dateFormat: 'd-m-Y H:i:S',
            }}
            className='form-input'
            value={form.last_usage || ''}
            disabled
          />

          <div>
            <label htmlFor='status'>{t('Status')}</label>
            <input
              id='status'
              name='status'
              className={`max-w-[200px] rounded-full border-white p-2 py-1 text-center font-bold text-white bg-${
                AssetStatus.find(x => x.value === form.status)?.color
              }`}
              value={
                form.status
                  ? AssetStatus.find(x => x.value === form.status)?.label || ''
                  : ''
              }
              disabled
            />
          </div>
          <label htmlFor='condition'>{t('Kondisi')}</label>
          <input
            id='condition'
            name='condition'
            className={`max-w-[200px] rounded-full border-white p-2 py-1 text-center font-bold text-white  bg-${
              AssetCondition.find(x => x.value === form.condition)?.color
            }`}
            disabled
            value={
              form.condition
                ? AssetCondition.find(x => x.value === form.condition)?.label ||
                  ''
                : ''
            }
          />
        </div>

        <div>
          <label htmlFor='description'>{t('description')}</label>
          <textarea
            id='description'
            name='description'
            rows={3}
            className='form-textarea'
            value={form.description || ''}
            required
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetailComponent;
