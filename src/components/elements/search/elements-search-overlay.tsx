'use client';
import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';

import IconSearch from '@/components/icon/icon-search'; // Make sure this path matches your actual file structure
import PanelCodeHighlight from '@/components/panel-code-highlight'; // Make sure this path matches your actual file structure

const ElementsSearchOverlay = () => {
  const [focus, setFocus] = useState(false);

  const overlaySearchClick = () => {
    setFocus(true);
  };

  const overlayClickAway = () => {
    setFocus(false);
  };

  return (
    <PanelCodeHighlight
      title='Overlay'
      codeHighlight={`
        import { useState } from 'react';
        import ClickAwayListener from 'react-click-away-listener';
        import IconSearch from 'src/components/icon/icon-search'; // Adjust the import path as needed
        // PanelCodeHighlight code...

        const ElementsSearchOverlay = () => {
          const [focus, setFocus] = useState(false);

          const overlaySearchClick = () => {
            setFocus(true);
          };

          const overlayClickAway = () => {
            setFocus(false);
          };

          return (
            <div className='mb-5 space-y-5'>
              <form>
                <ClickAwayListener onClickAway={overlayClickAway}>
                  <div className='search-form-overlay border-white-dark/20 relative h-12 w-full rounded-md border' onClick={overlaySearchClick}>
                    <input
                      type='text'
                      placeholder='Search...'
                      className=\`form-input peer hidden h-full bg-white placeholder:tracking-wider ltr:pl-12 rtl:pr-12 \${focus ? '!block' : ''}\`
                    />
                    <button type='button' className=\`text-dark/70 peer-focus:text-primary absolute inset-y-0 my-auto flex h-9 w-9 items-center justify-center p-0 ltr:right-1 rtl:left-1 \${focus ? '!ltr:!right-auto ltr:left-1 rtl:right-1' : ''}\`>
                      <IconSearch className='mx-auto h-5 w-5' />
                    </button>
                  </div>
                </ClickAwayListener>
              </form>
            </div>
          )
        };

        export default ElementsSearchOverlay;
      `}
    >
      <div className='mb-5 space-y-5'>
        <form>
          <ClickAwayListener onClickAway={overlayClickAway}>
            <div
              className='search-form-overlay border-white-dark/20 relative h-12 w-full rounded-md border'
              onClick={overlaySearchClick}
            >
              <input
                type='text'
                placeholder='Search...'
                className={`form-input peer hidden h-full bg-white placeholder:tracking-wider ltr:pl-12 rtl:pr-12 ${
                  focus ? '!block' : ''
                }`}
              />
              <button
                type='button'
                className={`text-dark/70 peer-focus:text-primary absolute inset-y-0 my-auto flex h-9 w-9 items-center justify-center p-0 ltr:right-1 rtl:left-1 ${
                  focus ? '!ltr:!right-auto ltr:left-1 rtl:right-1' : ''
                }`}
              >
                <IconSearch className='mx-auto h-5 w-5' />
              </button>
            </div>
          </ClickAwayListener>
        </form>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsSearchOverlay;
