'use client';
import React from 'react';
import Select from 'react-select';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsFormsSelectPlaceholder = () => {
  const options3 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
  ];

  return (
    <PanelCodeHighlight
      title='Placeholder'
      codeHighlight={`import Select from 'react-select';

const options3 = [
    { value: 'orange', label: 'Orange' },
    { value: 'white', label: 'White' },
    { value: 'purple', label: 'Purple' },
];

<Select placeholder="Choose..." options={options3} isSearchable={false}/>`}
    >
      <div className='mb-5'>
        <Select
          placeholder='Choose...'
          options={options3}
          isSearchable={false}
        />
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsFormsSelectPlaceholder;
