import { useState } from 'react';

import { getTranslation } from '@/lib/lang/i18n';

import { ResourceProperty } from '@/helpers/utils/fixed_asset/resource';

const { t } = getTranslation();
interface IResourceDetail {
  data: ResourceProperty;
}

const ResourceDetailComponent = ({ data }: IResourceDetail) => {
  const [form] = useState({
    pkid: data?.pkid || '',
    asset_pkid: data?.asset_pkid || '',
    resource_name: data?.resource_name || '',
    resource_longitude: data?.resource_longitude || '',
    resource_latitude: data?.resource_latitude || '',
    description: data?.description || '',
    office_pkid: data?.office_pkid || '',
    office_name: data?.office_name || '',
  });
  return (
    <div className='p-5'>
      <div className='space-y-5'>
        <div>
          <label htmlFor='asset_pkid'>
            {t('asset_id')} <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            disabled
            id='asset_pkid'
            name='asset_pkid'
            type='number'
            placeholder={t('enter_asset_id')}
            className='form-input'
            value={form.asset_pkid || ''}
          />
        </div>
        <div>
          <label htmlFor='resource_name'>
            {t('resource_name')} <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            disabled
            id='resource_name'
            name='resource_name'
            type='text'
            placeholder={t('enter_resource_name')}
            className='form-input'
            value={form.resource_name || ''}
          />
        </div>
        <div>
          <label htmlFor='resource_latitude'>
            {t('latitude')}
            <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            disabled
            id='resource_latitude'
            name='resource_latitude'
            type='number'
            placeholder={t('enter_latitude')}
            className='form-input'
            value={form.resource_latitude || ''}
          />
        </div>

        <div>
          <label htmlFor='resource_longitude'>
            {t('longitude')}
            <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            disabled
            id='resource_longitude'
            name='resource_longitude'
            type='number'
            placeholder={t('enter_longitude')}
            className='form-input'
            value={form.resource_longitude || ''}
          />
        </div>

        <div>
          <label htmlFor='description'>{t('description')}</label>
          <textarea
            disabled
            id='description'
            name='description'
            rows={3}
            className='form-textarea'
            placeholder={t('enter_description')}
            value={form.description || ''}
            required
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailComponent;
