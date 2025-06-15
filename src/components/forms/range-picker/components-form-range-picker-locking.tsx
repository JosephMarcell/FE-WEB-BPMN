'use client';
import Nouislider from '@x1mrdonut1x/nouislider-react';
import React, { useState } from 'react';

import 'nouislider/dist/nouislider.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsFormRangePickerLocking = () => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [skippingValue, setSkippingValue] = useState<number | number[]>(40);
  const [skippingValue1, setSkippingValue1] = useState<number | number[]>(40);

  const changeValue = () => {
    setDisabled(!disabled);
  };

  const displayValue = (value: number | number[]) =>
    Array.isArray(value) ? value.join(' - ') : value;

  return (
    <PanelCodeHighlight
      className='lg:col-span-2'
      title='Locking sliders together'
      codeHighlight={`import { useState } from 'react';

const [disabled, setDisabled] = useState<any>false;
const [skippingValue, setSkippingValue] = useState<any>(40);
const [skippingValue1, setSkippingValue1] = useState<any>(40);
const changeValue = () => {
    setDisabled(!disabled);
};

<div>
    <Nouislider
        disabled={disabled}
        start={40}
        range={{
            min: 0.0,
            max: 100.0
        }}
        tooltips={true}
        onSlide={(value) => setSkippingValue(value)}
    />
    <div>Value: {skippingValue}</div>
    <div className="text-primary font-bold mb-10" id="locking_slider1_value"></div>
    <Nouislider
        disabled={disabled}
        start={40}
        range={{
            min: 0.0,
            max: 100.0
        }}
        onSlide={(value) => setSkippingValue1(value)}
        tooltips={true}
    />
    <div>Value: {skippingValue1}</div>
    <div className="text-primary font-bold mb-10" id="locking_slider2_value"></div>
    <div className="ltr:text-right rtl:text-left">
        {disabled === false ? (
            <button type="button" className="btn btn-primary" onClick={changeValue} id="lockbutton">
                Lock
            </button>
        ) : (
            <button type="button" className="btn btn-primary" onClick={changeValue} id="unlockbutton">
                Unlock
            </button>
        )}
    </div>
</div>`}
    >
      <div className='mb-5 pt-5'>
        <Nouislider
          disabled={disabled}
          start={40}
          range={{
            min: 0.0,
            max: 100.0,
          }}
          tooltips={true}
          onSlide={value => setSkippingValue(value)}
        />
        <div>Value: {displayValue(skippingValue)}</div>
        <div
          className='text-primary mb-10 font-bold'
          id='locking_slider1_value'
        ></div>
        <Nouislider
          disabled={disabled}
          start={40}
          range={{
            min: 0.0,
            max: 100.0,
          }}
          onSlide={value => setSkippingValue1(value)}
          tooltips={true}
        />
        <div>Value: {displayValue(skippingValue1)}</div>
        <div
          className='text-primary mb-10 font-bold'
          id='locking_slider2_value'
        ></div>
        <div className='ltr:text-right rtl:text-left'>
          {!disabled ? (
            <button
              type='button'
              className='btn btn-primary'
              onClick={changeValue}
              id='lockbutton'
            >
              Lock
            </button>
          ) : (
            <button
              type='button'
              className='btn btn-primary'
              onClick={changeValue}
              id='unlockbutton'
            >
              Unlock
            </button>
          )}
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormRangePickerLocking;
