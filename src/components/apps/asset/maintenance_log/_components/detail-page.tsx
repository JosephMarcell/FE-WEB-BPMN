import { useState } from 'react';
import Flatpickr from 'react-flatpickr';

import { getTranslation } from '@/lib/lang/i18n';

import { AssetMaintenanceLogProperty } from '@/helpers/utils/fixed_asset/asset_maintenance_log';
import { AssetStatus } from '@/helpers/utils/global/listStatus';

const { t } = getTranslation();
interface MaintenanceLog {
  data: AssetMaintenanceLogProperty;
}

const AssetMaintenanceDetailComponent = ({ data }: MaintenanceLog) => {
  const [form] = useState({
    pkid: data?.pkid || '',
    model_name: data?.model_name || '',
    model_type: data?.model_type || '',
    user_name: data?.user_name || '',
    maintenance_start: data?.maintenance_start || '',
    maintenance_end: data?.maintenance_end || '',
    maintenance_type: data?.maintenance_type || '',
    status: data?.status || '',
    description: data?.description || '',
    office_name: data?.office_name || '',
  });

  return (
    <div className='panel border-white-light h-full px-5 py-5'>
      <h2 className='mb-4 text-lg font-semibold'>
        {t('maintenance_log_details')}
      </h2>
      <form className='space-y-4'>
        <div>
          <label htmlFor='pkid'>{t('maintenance_id')}</label>
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
          <label htmlFor='model_name'>{t('model_name')}</label>
          <input
            id='model_name'
            name='model_name'
            type='text'
            className='form-input'
            value={form.model_name || ''}
            disabled
          />
        </div>
        <div>
          <label htmlFor='model_type'>{t('model_type')}</label>
          <input
            id='model_type'
            name='model_type'
            type='text'
            className='form-input'
            value={form.model_type || ''}
            disabled
          />
        </div>
        <div>
          <label htmlFor='user_name'>{t('user_name')}</label>
          <input
            id='user_name'
            name='user_name'
            type='text'
            className='form-input'
            value={form.user_name || ''}
            disabled
          />
        </div>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <label htmlFor='maintenance_start'>{t('maintenance_start')}</label>
            <Flatpickr
              id='maintenance_start'
              name='maintenance_start'
              placeholder={t('select_date')}
              options={{
                dateFormat: 'd-m-Y',
              }}
              className='form-input'
              value={form.maintenance_start || ''}
              disabled
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='maintenance_end'>{t('maintenance_end')}</label>
            <Flatpickr
              id='maintenance_end'
              name='maintenance_end'
              placeholder={t('select_date')}
              options={{
                dateFormat: 'd-m-Y',
              }}
              className='form-input'
              value={form.maintenance_end || ''}
              disabled
            />
          </div>
        </div>
        <div>
          <label htmlFor='maintenance_type'>{t('maintenance_type')}</label>
          <input
            id='maintenance_type'
            name='maintenance_type'
            type='text'
            className='form-input'
            value={form.maintenance_type || ''}
            disabled
          />
        </div>
        <div>
          <label htmlFor='status'>{t('status')}</label>
          <input
            id='status'
            name='status'
            type='text'
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
        <div>
          <label htmlFor='description'>{t('description')}</label>
          <textarea
            id='description'
            name='description'
            rows={4}
            className='form-textarea'
            value={form.description || ''}
            disabled
          ></textarea>
        </div>
        <div>
          <label htmlFor='office_name'>{t('office_name')}</label>
          <input
            id='office_name'
            name='office_name'
            type='text'
            className='form-input'
            value={form.office_name || ''}
            disabled
          />
        </div>
      </form>
    </div>
  );
};

export default AssetMaintenanceDetailComponent;
