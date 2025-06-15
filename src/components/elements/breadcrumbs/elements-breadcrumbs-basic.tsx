import React from 'react';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsBreadcrumbsBasic = () => {
  return (
    <PanelCodeHighlight
      title='Basic'
      codeHighlight={`<ol className="flex text-gray-500 font-semibold dark:text-white-dark">
    <li>
        <button type="button">Components</button>
    </li>
    <li className="before:content-['/'] before:px-1.5">
        <button className="text-black dark:text-white-light hover:text-black/70 dark:hover:text-white-light/70">UI Kit</button>
    </li>
</ol>`}
    >
      <div className='mb-5'>
        <ol className='dark:text-white-dark flex font-semibold text-gray-500'>
          <li>
            <button type='button'>Components</button>
          </li>
          <li className="before:px-1.5 before:content-['/']">
            <button className='dark:text-white-light dark:hover:text-white-light/70 text-black hover:text-black/70'>
              UI Kit
            </button>
          </li>
        </ol>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsBreadcrumbsBasic;
