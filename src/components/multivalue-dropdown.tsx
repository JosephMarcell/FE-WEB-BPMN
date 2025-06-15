import React from 'react';

import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';

type DropdownOption = {
  value: string;
  label: string;
};

type MultivalueDropdownProps = {
  options: DropdownOption[];
  placeholder: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

const MultivalueDropdown: React.FC<MultivalueDropdownProps> = ({
  options,
  placeholder,
  selectedValues,
  onChange,
}) => {
  const handleCheckboxChange = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(updatedValues);
  };

  return (
    <div className='dropdown'>
      <Dropdown
        placement='bottom-start'
        btnClassName='!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark'
        button={
          <>
            <span className='ltr:mr-1 rtl:ml-1'>
              {selectedValues.length > 0
                ? selectedValues
                    .map(
                      value =>
                        options.find(option => option.value === value)?.label,
                    )
                    .join(', ')
                : placeholder}
            </span>
            <IconCaretDown className='h-5 w-5' />
          </>
        }
      >
        <ul className='!min-w-fit whitespace-nowrap '>
          {options.map(option => (
            <li
              key={option.value}
              className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={e => e.stopPropagation()}
            >
              <label className='mb-0 cursor-pointer'>
                <input
                  type='checkbox'
                  className='form-checkbox mr-2 '
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
};

export default MultivalueDropdown;
