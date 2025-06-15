import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsButtonGroupHorizontal = () => {
  return (
    <PanelCodeHighlight
      title='Horizontal'
      codeHighlight={`<div className="relative inline-flex align-middle">
    <button type="button" className="btn btn-dark ltr:rounded-r-none rtl:rounded-l-none">
        Left
    </button>
    <button type="button" className="btn btn-dark rounded-none">
        Middle
    </button>
    <button type="button" className="btn btn-dark ltr:rounded-l-none rtl:rounded-r-none">
        Right
    </button>
</div>`}
    >
      <div className='mb-5 text-center'>
        <div className='relative inline-flex align-middle'>
          <button
            type='button'
            className='btn btn-dark ltr:rounded-r-none rtl:rounded-l-none'
          >
            Left
          </button>
          <button type='button' className='btn btn-dark rounded-none'>
            Middle
          </button>
          <button
            type='button'
            className='btn btn-dark ltr:rounded-l-none rtl:rounded-r-none'
          >
            Right
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsButtonGroupHorizontal;
