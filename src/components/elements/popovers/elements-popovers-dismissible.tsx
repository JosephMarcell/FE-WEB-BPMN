'use client';
import Tippy from '@tippyjs/react';
import React from 'react';

import 'tippy.js/dist/tippy.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsPopoversDismissible = () => {
  return (
    <PanelCodeHighlight
      title='Dismissible popover'
      codeHighlight={`import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

<Tippy trigger="click" content="Popover on left" placement="left">
    <button type="button" data-dismissable="true" className="btn btn-dark">
        Popover on left
    </button>
</Tippy>`}
    >
      <div className='mb-5'>
        <div className='flex w-full justify-center gap-4'>
          <Tippy trigger='click' content='Popover on left' placement='left'>
            <button
              type='button'
              data-dismissable='true'
              className='btn btn-dark'
            >
              Popover on left
            </button>
          </Tippy>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsPopoversDismissible;
