'use client';
import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useSelector } from 'react-redux';

import 'flatpickr/dist/flatpickr.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

const ComponentsFormDatePickerRange = () => {
  const [date3, setDate3] = useState<string>('2022-07-05 to 2022-07-10');
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig?.rtlClass) === 'rtl';

  return (
    <PanelCodeHighlight
      title='Range Calendar'
      codeHighlight={`import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const [date3, setDate3] = useState<any>('2022-07-05 to 2022-07-10');

<Flatpickr
    options={{
        mode: 'range',
        dateFormat: 'Y-m-d',
        position: isRtl ? 'auto right' : 'auto left'
    }}
    defaultValue={date3}
    className="form-input"
    onChange={(date3) => setDate3(date3)}
/>`}
    >
      <div className='mb-2.5'>
        Use <code className='text-danger'>{`{mode: 'range'}`}</code> select the
        date with range.
      </div>
      <div className='mb-5'>
        <Flatpickr
          options={{
            mode: 'range',
            dateFormat: 'Y-m-d',
            position: isRtl ? 'auto right' : 'auto left',
          }}
          defaultValue={date3}
          className='form-input'
          onChange={selectedDates => {
            const dates = selectedDates.map(date =>
              date.toISOString().substring(0, 10),
            );
            setDate3(dates.join(' to '));
          }}
        />
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormDatePickerRange;
