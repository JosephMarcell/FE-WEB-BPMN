'use client';
import React from 'react';
import Swal from 'sweetalert2';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsSweetAlertsCustomImage = () => {
  const showAlert = async () => {
    await Swal.fire({
      title: 'Sweet!',
      text: 'Modal with a custom image.',
      imageUrl: '/assets/images/custom-swal.svg',
      imageWidth: 224,
      imageHeight: 'auto',
      imageAlt: 'Custom image',
      padding: '2em',
      customClass: {
        popup: 'sweet-alerts', // Class for the popup
      },
    });
  };
  return (
    <PanelCodeHighlight
      title='Message with custom image'
      codeHighlight={`import Swal from 'sweetalert2';

const showAlert = async () => {
    Swal.fire({
        title: 'Sweet!',
        text: 'Modal with a custom image.',
        imageUrl: '/assets/images/custom-swal.svg',
        imageWidth: 224,
        imageHeight: 'auto',
        imageAlt: 'Custom image',
        padding: '2em',
        customClass: 'sweet-alerts',
    });
}

<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-secondary" onClick={() => showAlert()}>
            Message with custom image
        </button>
    </div>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex items-center justify-center'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => showAlert()}
          >
            Message with custom image
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsSweetAlertsCustomImage;
