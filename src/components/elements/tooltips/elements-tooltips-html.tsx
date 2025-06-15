'use client';
import Tippy from '@tippyjs/react';
import React from 'react';

import 'tippy.js/dist/tippy.css';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsTooltipsHtml = () => {
  return (
    <PanelCodeHighlight
      title='HTML'
      codeHighlight={`import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

<Tippy content="Bolded content">
    <button type="button" data-dismissable="true" className="btn btn-dark">
        Tooltip on HTML
    </button>
</Tippy>`}
    >
      <div className='mb-5'>
        <div className='flex w-full justify-center gap-4'>
          <Tippy content={<strong>Bolded content</strong>}>
            <button
              type='button'
              data-dismissable='true'
              className='btn btn-dark'
            >
              Tooltip on HTML
            </button>
          </Tippy>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsTooltipsHtml;
