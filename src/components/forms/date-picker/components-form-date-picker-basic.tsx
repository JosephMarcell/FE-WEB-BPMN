'use client';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';

import 'flatpickr/dist/flatpickr.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

const ComponentsFormDatePickerBasic = () => {
  const isRtl = useSelector(
    (state: IRootState) => state?.themeConfig?.rtlClass === 'rtl',
  );
  const [date1, setDate1] = useState<Date | string>('2022-07-05');

  return (
    <PanelCodeHighlight title='Basic'>
      <div className='mb-5'>
        <Flatpickr
          value={date1}
          options={{
            dateFormat: 'Y-m-d',
            position: isRtl ? 'auto right' : 'auto left',
          }}
          className='form-input'
          onChange={date => setDate1(date[0])}
        />
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormDatePickerBasic;
