'use client';
import React from 'react';
import Swal from 'sweetalert2';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsSweetAlertsBasic = () => {
  const showAlert = async () => {
    await Swal.fire({
      title: 'Saved successfully',
      padding: '2em',
      customClass: {
        popup: 'sweet-alerts', // Class for the popup
      },
    });
  };

  return (
    <PanelCodeHighlight
      title='Basic message'
      codeHighlight={`import Swal from 'sweetalert2';

const showAlert = async () => {
    await Swal.fire({
        title: 'Saved successfully', // Fix typo from 'succesfully'
        padding: '2em',
        customClass: {
          popup: 'sweet-alerts', // Class for the popup
        },
    });
}

<div className="flex items-center justify-center">
    <button type="button" className="btn btn-primary" onClick={showAlert}>
        Basic message
    </button>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex items-center justify-center'>
          <button type='button' className='btn btn-primary' onClick={showAlert}>
            Basic message
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsSweetAlertsBasic;
