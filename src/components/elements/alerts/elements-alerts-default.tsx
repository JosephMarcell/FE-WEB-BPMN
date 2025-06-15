import React from 'react';

import IconX from '@/components/icon/icon-x';
import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsAlertsDefault = () => {
  return (
    <PanelCodeHighlight
      title='Default Alerts'
      codeHighlight={`<div className="flex items-center p-3.5 rounded text-primary bg-primary-light dark:bg-primary-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Primary!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>

<div className="flex items-center p-3.5 rounded text-secondary bg-secondary-light dark:bg-secondary-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Secondary!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>

<div className="flex items-center p-3.5 rounded text-success bg-success-light dark:bg-success-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Success!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>

<div className="flex items-center p-3.5 rounded text-warning bg-warning-light dark:bg-warning-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Warning!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>

<div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Danger!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>

<div className="flex items-center p-3.5 rounded text-info bg-info-light dark:bg-info-dark-light">
    <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">Info!</strong>Lorem Ipsum is simply dummy text of the printing.
    </span>
    <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
    <svg> ... </svg>
    </button>
</div>
                                `}
    >
      <div className='mb-5 grid gap-5 lg:grid-cols-2'>
        <div className='bg-primary-light text-primary dark:bg-primary-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Primary!</strong>Lorem Ipsum
            is simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
        <div className='bg-secondary-light text-secondary dark:bg-secondary-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Secondary!</strong>Lorem Ipsum
            is simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
        <div className='bg-success-light text-success dark:bg-success-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Success!</strong>Lorem Ipsum
            is simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
        <div className='bg-warning-light text-warning dark:bg-warning-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Warning!</strong>Lorem Ipsum
            is simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
        <div className='bg-danger-light text-danger dark:bg-danger-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Danger!</strong>Lorem Ipsum is
            simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
        <div className='bg-info-light text-info dark:bg-info-dark-light flex items-center rounded p-3.5'>
          <span className='ltr:pr-2 rtl:pl-2'>
            <strong className='ltr:mr-1 rtl:ml-1'>Info!</strong>Lorem Ipsum is
            simply dummy text of the printing.
          </span>
          <button
            type='button'
            className='hover:opacity-80 ltr:ml-auto rtl:mr-auto'
          >
            <IconX className='h-5 w-5' />
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsAlertsDefault;
