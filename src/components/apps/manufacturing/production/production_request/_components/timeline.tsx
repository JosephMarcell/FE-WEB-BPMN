import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

import './Timeline.css';

import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

import { PredictResultProperty } from '@/helpers/utils/scheduling/predict';

interface PredictDetail {
  data: PredictResultProperty[];
  modal?: boolean;
  setModal: (value: boolean) => void;
}

const PredictTimeline = ({ data, modal, setModal }: PredictDetail) => {
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const groupedData: { [key: number]: PredictResultProperty[] } = data.reduce(
    (acc, item: PredictResultProperty) => {
      (acc[item.order ?? 0] = acc[item.order ?? 0] || []).push(item);
      return acc;
    },
    {} as { [key: number]: PredictResultProperty[] },
  );

  const handleClose = () => {
    if (modal) {
      setModal(false);
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        open={modal}
        onClose={() => {
          if (modal) {
            setModal(true);
          }
        }}
      >
        <div className='fixed inset-0' />
        <Transition.Child
          as='div'
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 z-[998] overflow-y-auto bg-[black]/60'>
            <div className='flex min-h-screen items-start justify-center px-4'>
              <Dialog.Panel className='panel animate__animated animate__slideInDown dark:text-white-dark my-8 w-full max-w-6xl overflow-hidden rounded-lg border-0 p-0 text-black'>
                <div className='flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]'>
                  <h5 className='text-lg font-bold'>Predict Result</h5>
                  <button
                    onClick={handleClose}
                    type='button'
                    className='text-white-dark hover:text-dark'
                  >
                    <IconX />
                  </button>
                </div>
                <div className='p-5'>
                  <div className='timeline-container'>
                    {Object.keys(groupedData)
                      .sort((a: string, b: string) => Number(a) - Number(b))
                      .map(order => (
                        <div key={order} className='timeline-group'>
                          {groupedData[Number(order)].map(
                            (item: PredictResultProperty, index: number) => (
                              <div key={index} className='timeline-item'>
                                <div
                                  className='timeline-item-content'
                                  data-tooltip-id={`tooltip-${item.name}-${index}`}
                                >
                                  <span className='order-number'>
                                    {item.order}
                                  </span>
                                  <h3 className='operation-name'>
                                    {item.name}
                                  </h3>
                                  <p>start : {item.start}</p>
                                  <p>finish : {item.finish}</p>
                                  <span className='circle' />
                                  {index <
                                    groupedData[Number(order)].length - 1 && (
                                    <span className='horizontal-line' />
                                  )}
                                </div>
                                <Tooltip
                                  id={`tooltip-${item.name}-${index}`}
                                  events={['hover']}
                                  place={isRtl ? 'left' : 'right'}
                                  style={{
                                    backgroundColor: 'rgb(255, 255, 255)',
                                    color: '#4361ee',
                                    zIndex: 997,
                                  }}
                                  className='absolute z-[997]'
                                >
                                  <div>
                                    <h3 className='font-bold'>
                                      Daftar Pekerja
                                    </h3>
                                    <ul>
                                      {item.employee_id.map(
                                        (employee, empIndex) => (
                                          <li key={empIndex}>
                                            {employee.name}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </Tooltip>
                              </div>
                            ),
                          )}
                          {parseInt(order) <
                            Object.keys(groupedData).length && (
                            <span className='vertical-line' />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default PredictTimeline;
