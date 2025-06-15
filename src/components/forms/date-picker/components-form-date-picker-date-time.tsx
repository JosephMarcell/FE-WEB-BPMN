'use client';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';

import 'flatpickr/dist/flatpickr.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

const ComponentsFormDatePickerDateTime = () => {
  const isRtl = useSelector(
    (state: IRootState) => state.themeConfig?.rtlClass === 'rtl',
  );
  const [date2, setDate2] = useState<Date | string>('2022-07-05 12:00');

  return (
    <PanelCodeHighlight
      title='Date Time'
      codeHighlight={`
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const [date2, setDate2] = useState<Date | string>('2022-07-05 12:00');

<Flatpickr
    data-enable-time
    options={{
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        position: isRtl ? 'auto right' : 'auto left'
    }}
    defaultValue={date2}
    className="form-input"
    onChange={(date2) => setDate2(date2)}
/>`}
    >
      <div className='mb-2.5'>
        Use <code className='text-danger'>&nbsp;</code>
        {` {enableTime: true, dateFormat: 'Y-m-d H:i'}`}
        option to enable time support.
      </div>
      <div className='mb-5'>
        <Flatpickr
          data-enable-time
          options={{
            enableTime: true,
            dateFormat: 'Y-m-d H:i',
            position: isRtl ? 'auto right' : 'auto left',
          }}
          value={date2}
          className='form-input'
          onChange={date => setDate2(date[0])}
        />
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormDatePickerDateTime;
