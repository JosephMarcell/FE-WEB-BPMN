'use client';
import IconX from '@/components/icon/icon-x';

const HelpCenter = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}) => {
  if (!showModal) return null;

  return (
    <div className='fixed inset-0 z-[51] flex items-center justify-center bg-[black]/60'>
      <div className='relative max-h-screen w-full max-w-lg overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-black'>
        {/* Close button */}
        <button
          type='button'
          className='absolute right-2 top-2 text-black dark:text-white'
          onClick={() => setShowModal(false)}
        >
          <IconX className='h-5 w-5' />
        </button>

        <h4 className='mb-4 text-lg font-bold dark:text-white'>Help Center</h4>

        <div className='space-y-6'>
          {/* General Help Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              General Support
            </h5>
            <p className='text-white-dark text-sm'>
              If you encounter issues, feel free to contact support for
              assistance.
            </p>
            <p className='mt-2 text-sm'>
              Email:{' '}
              <a href='mailto:support@drone-meq.com' className='text-primary'>
                support@drone-meq.com
              </a>
            </p>
            <p className='text-sm'>
              Phone:{' '}
              <a href='tel:+123456789' className='text-primary'>
                +1 234 567 89
              </a>
            </p>
          </div>

          {/* FAQ Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Frequently Asked Questions
            </h5>
            <ul className='text-white-dark mt-2 list-disc space-y-2 pl-5 text-sm'>
              <li>How can I reset my password?</li>
              <li>How to configure my drone?</li>
              <li>Where can I find the user manual?</li>
            </ul>
          </div>

          {/* Feedback Section */}
          <div className='border-white-light mb-3 rounded-md border border-dashed p-3 dark:border-[#1b2e4b]'>
            <h5 className='mb-1 text-base leading-none dark:text-white'>
              Feedback
            </h5>
            <p className='text-white-dark text-sm'>
              Have feedback or suggestions? We’d love to hear from you!
            </p>
            <button
              type='button'
              className='bg-primary mt-3 w-full rounded py-2 text-white'
              onClick={() => alert('Feedback form coming soon!')}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
