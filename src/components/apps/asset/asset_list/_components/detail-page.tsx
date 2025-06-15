function formatAssetLastUsage(dateString: string) {
  if (!dateString) return '';
  const [datePart, timePart] = dateString.split(' ');
  if (!datePart || !timePart) return dateString;

  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split(':');
  const formattedSecond = second.slice(0, 2);

  return `${day}-${month}-${year} ${hour}:${minute}:${formattedSecond}`;
}

import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';

import { getTranslation } from '@/lib/lang/i18n';

import { AssetListProperty } from '@/helpers/utils/fixed_asset/asset_list';
import { AssetCondition, AssetStatus } from '@/helpers/utils/global/listStatus';

const { t } = getTranslation();

interface IAssetListDetail {
  data: AssetListProperty;
}

const AssetListDetailComponent = ({ data }: IAssetListDetail) => {
  const [form] = useState({
    assetCode: data?.asset_code || '',
    assetType: data?.asset_type || '',
    lastUsage: data?.last_usage ? formatAssetLastUsage(data.last_usage) : '',
    status: data?.status || '',
    condition: data?.condition || '',
    description: data?.description || '',
  });

  return (
    <div className='panel border-white-light h-full px-0'>
      <div className='p-5'>
        <div className='space-y-5'>
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex flex-1 flex-col '>
              <label htmlFor='assetCode'>{t('asset_id')}</label>
              <input
                id='assetCode'
                name='assetCode'
                type='text'
                placeholder={t('asset_id')}
                className='form-input'
                value={form.assetCode}
                disabled
              />
            </div>

            <div className='flex flex-1 flex-col '>
              <label htmlFor='assetType'>{t('asset_type')}</label>
              <input
                id='assetType'
                name='assetType'
                className='form-input'
                disabled
                value={form.assetType ? form.assetType : ''}
              />
            </div>
          </div>

          <label htmlFor='lastUsage'>{t('last_usage')}</label>
          <Flatpickr
            id='lastUsage'
            name='lastUsage'
            options={{
              dateFormat: 'd-m-Y H:i:S',
            }}
            className='form-input'
            value={form.lastUsage || ''}
            disabled
          />
          <div className='flex flex-row justify-between gap-4'>
            <div className='flex flex-1 flex-col'>
              <label htmlFor='status'>{t('status')}</label>
              <input
                id='status'
                name='status'
                className={`max-w-[200px] rounded-full border-white p-2 py-1 text-center font-bold text-white bg-${
                  AssetStatus.find(x => x.value === form.status)?.color
                }`}
                value={
                  form.status
                    ? AssetStatus.find(x => x.value === form.status)?.label ||
                      ''
                    : ''
                }
              />
            </div>

            <div className='flex flex-1 flex-col'>
              <label htmlFor='condition'>{t('condition')}</label>
              <input
                id='condition'
                name='condition'
                className={`max-w-[200px] rounded-full border-white p-2 py-1 text-center font-bold text-white  bg-${
                  AssetCondition.find(x => x.value === form.condition)?.color
                }`}
                disabled
                value={
                  form.condition
                    ? AssetCondition.find(x => x.value === form.condition)
                        ?.label || ''
                    : ''
                }
              />
            </div>
          </div>
          <label htmlFor='description'>{t('description')}</label>
          <input
            id='description'
            name='description'
            type='text'
            disabled
            className='form-input'
            value={form.description}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetListDetailComponent;
