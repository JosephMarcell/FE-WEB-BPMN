'use client';
import React from 'react';
import Swal from 'sweetalert2';

import PanelCodeHighlight from '@/components/panel-code-highlight';

const ComponentsSweetAlertsChainingModals = () => {
  const showAlert = async () => {
    const steps = ['1', '2', '3'];
    const swalQueueStep = Swal.mixin({
      confirmButtonText: 'Next →',
      showCancelButton: true,
      progressSteps: steps,
      input: 'text',
      inputAttributes: {
        required: 'true',
      },
      validationMessage: 'This field is required',
      padding: '2em',
      customClass: {
        popup: 'sweet-alerts', // Use object notation
      },
    });

    const values: string[] = [];
    let currentStep;

    for (currentStep = 0; currentStep < steps.length; ) {
      const result = await swalQueueStep.fire({
        title: `Question ${steps[currentStep]}`,
        text: currentStep === 0 ? 'Chaining swal modals is easy.' : '',
        inputValue: values[currentStep],
        showCancelButton: currentStep > 0,
        currentProgressStep: currentStep,
        customClass: {
          popup: 'sweet-alerts', // Use object notation
        },
      });

      if (result.value) {
        values[currentStep] = result.value;
        currentStep++;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        currentStep--;
      } else {
        break;
      }
    }

    if (currentStep === steps.length) {
      await Swal.fire({
        title: 'All done!',
        padding: '2em',
        html: 'Your answers: <pre>' + JSON.stringify(values) + '</pre>',
        confirmButtonText: 'Lovely!',
        customClass: {
          popup: 'sweet-alerts', // Use object notation
        },
      });
    }
  };

  return (
    <PanelCodeHighlight
      title='Chaining modals (queue)'
      codeHighlight={`import Swal from 'sweetalert2';

const showAlert = async() => {
    const steps = ['1', '2', '3'];
    const swalQueueStep = Swal.mixin({
        confirmButtonText: 'Next →',
        showCancelButton: true,
        progressSteps: steps,
        input: 'text',
        inputAttributes: {
            required: 'true',
        },
        validationMessage: 'This field is required',
        padding: '2em',
        customClass: {
          popup: 'sweet-alerts', // Use object notation
        },
    });
    const values: any = [];
    let currentStep;
    for (currentStep = 0; currentStep < steps.length; ) {
        const result = await swalQueueStep.fire({
            title: \`Question \${steps[currentStep]}\`,
            text: currentStep === 0 ? 'Chaining swal modals is easy.' : '',
            inputValue: values[currentStep],
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,
            customClass: {
              popup: 'sweet-alerts', // Use object notation
            },
        });
        if (result.value) {
            values[currentStep] = result.value;
            currentStep++;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            currentStep--;
        } else {
            break;
        }
    }
    if (currentStep === steps.length) {
        await Swal.fire({
            title: 'All done!',
            padding: '2em',
            html: 'Your answers: <pre>' + JSON.stringify(values) + '</pre>',
            confirmButtonText: 'Lovely!',
            customClass: {
              popup: 'sweet-alerts', // Use object notation
            },
        });
    }
}

<div className="mb-5">
    <div className="flex items-center justify-center">
        <button type="button" className="btn btn-warning" onClick={showAlert}>
            Chaining modals (queue)
        </button>
    </div>
</div>`}
    >
      <div className='mb-5'>
        <div className='flex items-center justify-center'>
          <button type='button' className='btn btn-warning' onClick={showAlert}>
            Chaining modals (queue)
          </button>
        </div>
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsSweetAlertsChainingModals;
