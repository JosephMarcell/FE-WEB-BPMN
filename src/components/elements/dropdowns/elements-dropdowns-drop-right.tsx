'use client';
import React from 'react';

import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';
import PanelCodeHighlight from '@/components/panel-code-highlight';

const ElementsDropdownsDropRight = () => {
  const placement = 'right';

  return (
    <PanelCodeHighlight
      title='Dropright'
      codeHighlight={`import Dropdown from 'src/components/dropdown';

<div className="dropdown">
    <Dropdown
        placement={\`\${isRtl ? 'right-end' : 'right-start'}\`}
        btnClassName="btn btn-warning dropdown-toggle !flex"
        button={
            <>
                Right
                <svg>...</svg>
            </>
        }
    >
        <ul className="!min-w-[170px]">
            <li>
                <button type="button">
                    Action
                </button>
            </li>
            <li>
                <button type="button">
                    Another action
                </button>
            </li>
            <li>
                <button type="button">
                    Something else here
                </button>
            </li>
            <li>
                <button type="button">
                    Separated link
                </button>
            </li>
        </ul>
    </Dropdown>
</div>

<div className="dropdown">
    <Dropdown
        placement={\`\${isRtl ? 'right-end' : 'right-start'}\`}
        btnClassName="btn btn-outline-warning dropdown-toggle !flex"
        button={
            <>
                Right
                <svg>...</svg>
            </>
        }
    >
        <ul className="!min-w-[170px]">
            <li>
                <button type="button">
                    Action
                </button>
            </li>
            <li>
                <button type="button">
                    Another action
                </button>
            </li>
            <li>
                <button type="button">
                    Something else here
                </button>
            </li>
            <li>
                <button type="button">
                    Separated link
                </button>
            </li>
        </ul>
    </Dropdown>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex w-full flex-wrap justify-around gap-7'>
          <div className='flex items-center justify-center'>
            <div className='dropdown'>
              <Dropdown
                placement={placement}
                btnClassName='btn btn-warning dropdown-toggle !flex'
                button={
                  <>
                    Right
                    <IconCaretDown className='inline-block -rotate-90 ltr:ml-1 rtl:mr-1 rtl:rotate-90' />
                  </>
                }
              >
                <ul className='!min-w-[170px]'>
                  <li>
                    <button type='button'>Action</button>
                  </li>
                  <li>
                    <button type='button'>Another action</button>
                  </li>
                  <li>
                    <button type='button'>Something else here</button>
                  </li>
                  <li>
                    <button type='button'>Separated link</button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <div className='dropdown'>
              <Dropdown
                placement='right'
                btnClassName='btn btn-warning dropdown-toggle !flex'
                button={
                  <>
                    Right
                    <IconCaretDown className='inline-block -rotate-90 ltr:ml-1 rtl:mr-1 rtl:rotate-90' />
                  </>
                }
              >
                <ul className='!min-w-[170px]'>
                  <li>
                    <button type='button'>Action</button>
                  </li>
                  <li>
                    <button type='button'>Another action</button>
                  </li>
                  <li>
                    <button type='button'>Something else here</button>
                  </li>
                  <li>
                    <button type='button'>Separated link</button>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ElementsDropdownsDropRight;
