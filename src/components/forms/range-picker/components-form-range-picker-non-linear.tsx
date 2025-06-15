'use client';
import Nouislider from '@x1mrdonut1x/nouislider-react';
import React, { useState } from 'react';

import 'nouislider/dist/nouislider.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsFormRangePickerNonLinear = () => {
  const [slider2, setSlider2] = useState<[number, number]>([500, 4000]);
  const [percent2, setPercent2] = useState<[number, number]>([5, 40]);
  const onSide = (
    _: unknown,
    __: unknown,
    value: number[],
    ___: unknown,
    percent: number[],
  ) => {
    setSlider2([value[0], value[1]]);
    setPercent2([percent[0], percent[1]]);
  };

  return (
    <PanelCodeHighlight
      title='Non linear slider'
      codeHighlight={`import { useState } from 'react';

const [slider2, setSlider2] = useState<any>([500, 4000]);
const [percent2, setPercent2] = useState<any>([5, 40]);
const onSide = (render: any, handle: any, value: any, un: any, percent: any) => {
    setSlider2(value);
    setPercent2(percent);
};

<div>
    <Nouislider
        connect
        start={[500, 4000]}
        behaviour="tap"
        range={{
            min: [0],
            '10%': [500, 500],
            '50%': [4000, 1000],
            max: [10000]
        }}
        onSlide={onSide}
        tooltips={true}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-5 font-bold">
        <div>
            <span className="text-primary mr-2" id="nouiMin2">
                {parseInt(slider2[0]).toFixed(2)}
            </span>
            <span className="border border-white-light dark:border-dark py-1 px-2 text-dark dark:text-white-dark rounded" id="nouiMin2Perc">
                {\`\${parseInt(percent2[0])}%\`}
            </span>
        </div>
        <div className="ltr:text-right rtl:text-left">
            <span className="text-primary mr-2" id="nouiMax2">
                {parseInt(slider2[1]).toFixed(2)}
            </span>
            <span className="border border-white-light dark:border-dark py-1 px-2 text-dark dark:text-white-dark rounded" id="nouiMax2Perc">
                {\`\${parseInt(percent2[1])}%\`}
            </span>
        </div>
    </div>
</div>`}
    >
      <div className='mb-5 pt-5'>
        <Nouislider
          connect
          start={[500, 4000]}
          behaviour='tap'
          range={{
            min: [0],
            '10%': [500, 500],
            '50%': [4000, 1000],
            max: [10000],
          }}
          onSlide={onSide}
          tooltips={true}
        />

        <div className='my-5 grid grid-cols-1 gap-8 font-bold lg:grid-cols-2'>
          <div>
            <span className='text-primary mr-2' id='nouiMin2'>
              {slider2[1].toFixed(2)}
            </span>
            <span
              className='border-white-light text-dark dark:border-dark dark:text-white-dark rounded border px-2 py-1'
              id='nouiMin2Perc'
            >
              {`${percent2[0]}%`}
            </span>
          </div>
          <div className='ltr:text-right rtl:text-left'>
            <span className='text-primary mr-2' id='nouiMax2'>
              {slider2[1].toFixed(2)}
            </span>
            <span
              className='border-white-light text-dark dark:border-dark dark:text-white-dark rounded border px-2 py-1'
              id='nouiMax2Perc'
            >
              {`${percent2[0]}%`}
            </span>
          </div>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormRangePickerNonLinear;
