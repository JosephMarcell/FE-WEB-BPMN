/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-var */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */

'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDetailDrone } from '@/hooks/useDetailDrone';

const mapDetail = (data: any) => {
  return {
    label: '',
    data: [
      {
        key: 'drone_id',
        label: 'Drone ID',
        value: data?.id,
      },
      {
        key: 'status',
        label: 'Status',
        value: data?.stasus,
      },
      {
        key: 'coordinates',
        label: 'Coordinates',
        value: `${data?.location?.latitude}, ${data?.location?.longitude}`,
        class: 'col-span-2',
      },
    ],
  };
};

export const Detail = (props: any) => {
  const { handleClickMarker, show, data } = props;
  const setDetailDrone = useDetailDrone((state: any) => state.setShow);

  const modalRef = useRef<any>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    show ? modalRef.current.showModal() : modalRef.current.close();
  }, [show]);

  const handleClose = () => {
    if (handleClickMarker) {
      handleClickMarker();
    }
  };

  const handleESC = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    handleClose();
  };

  const handleCloseDetail = () => {
    setDetailDrone(false);
    modalRef.current.close();
  };

  const targetElement = document.querySelector(`.detailDrone`);

  const modalElement = (
    <dialog
      id='drone_modal'
      ref={modalRef}
      className='modal modal-bottom sm:modal-middle flex'
      onCancel={handleESC}
    >
      <div className='modal-box m-auto bg-white/40'>
        <div className='mx-auto flex w-full flex-col gap-5'>
          {/* Header */}
          <form method='dialog'>
            <h3 className='text-lg font-bold'>{data.marker?.id}</h3>
            <button
              className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'
              onClick={handleCloseDetail}
            >
              ✕
            </button>
          </form>

          {/* Logo */}
          {data.marker.image ? (
            <img
              src={data.marker.image}
              width={150}
              height={150}
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          ) : (
            <div className='text-center text-gray-500'>No image available</div>
          )}

          {/* Drone Details */}
          <div className='grid gap-4 overflow-y-auto'>
            <div className='rounded bg-white p-4 shadow'>
              {mapDetail(data.marker).data.map(item => (
                <div key={item.key} className='mb-2'>
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );

  return ReactDOM.createPortal(modalElement, targetElement as Element);
};

export default Detail;
