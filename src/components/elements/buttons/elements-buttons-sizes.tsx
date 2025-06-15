import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsButtonsSizes = () => {
  return (
    <PanelCodeHighlight
      title='Button Sizes'
      codeHighlight={`{/*Button Sizes*/}

<button type="button" className="btn btn-primary btn-lg">Primary</button>

<button type="button" className="btn btn-info">Info</button>

<button type="button" className="btn btn-success btn-sm">Success</button>

<button type="button" className="btn btn-warning btn-sm">Warning</button>`}
    >
      <div className='mb-5'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <button type='button' className='btn btn-primary btn-lg'>
            Primary
          </button>
          <button type='button' className='btn btn-info'>
            Info
          </button>
          <button type='button' className='btn btn-success btn-sm'>
            Success
          </button>
          <button type='button' className='btn btn-warning btn-sm'>
            Warning
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsButtonsSizes;
