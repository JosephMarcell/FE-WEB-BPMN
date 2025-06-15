'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
const items1 = [
  {
    id: 1,
    text: 'Need to be approved',
    name: 'Kelly Young',
  },
  {
    id: 2,
    text: 'Meeting with client',
    name: 'Andy King',
  },
  {
    id: 3,
    text: 'Project Detail',
    name: 'Judy Holmes',
  },
  {
    id: 4,
    text: 'Edited Post Approval',
    name: 'Vincent Carpenter',
  },
  {
    id: 5,
    text: 'Project Lead Pickup',
    name: 'Mary McDonald',
  },
];
const items2 = [
  {
    id: 6,
    text: 'Need to be approved',
    name: 'Kelly Young',
  },
  {
    id: 7,
    text: 'Meeting with client',
    name: 'Andy King',
  },
  {
    id: 8,
    text: 'Project Detail',
    name: 'Judy Holmes',
  },
  {
    id: 9,
    text: 'Edited Post Approval',
    name: 'Vincent Carpenter',
  },
  {
    id: 10,
    text: 'Project Lead Pickup',
    name: 'Mary McDonald',
  },
];
const ComponentsDragndropDelete = () => {
  const [delete1, setDelete1] = useState(items1);
  const [delete2, setDelete2] = useState(items2);
  return (
    <div className='panel'>
      <div className='mb-5 text-lg font-semibold dark:text-white'>
        Delete User
      </div>
      <div className='grid grid-cols-1 gap-x-12 sm:grid-cols-2'>
        <div>
          <ul id='example7'>
            <ReactSortable
              list={delete1}
              setList={setDelete1}
              animation={200}
              group='delete'
              removeOnSpill={true}
              //
              className='min-h-[200px]'
            >
              {delete1.map(item => {
                return (
                  <li key={item.id} className='mb-2.5 cursor-grab'>
                    <div className='items-md-center border-white-light dark:border-dark flex flex-col rounded-md border bg-white px-6 py-3.5 md:flex-row ltr:text-left rtl:text-right dark:bg-[#1b2e4b]'>
                      <div className='ltr:sm:mr-4 rtl:sm:ml-4'>
                        <Image
                          alt='avatar'
                          src={`/assets/images/profile-${item.id}.jpeg`}
                          className='mx-auto h-11 w-11 rounded-full'
                          width={44}
                          height={44}
                        />
                      </div>
                      <div className='flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left'>
                        <div className='my-3 font-semibold md:my-0'>
                          <div className='text-dark text-base dark:text-[#bfc9d4]'>
                            {item.text}
                          </div>
                          <div className='text-white-dark text-xs'>
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ReactSortable>
          </ul>
        </div>

        <div>
          <ul id='example8'>
            <ReactSortable
              list={delete2}
              setList={setDelete2}
              animation={200}
              group='delete'
              removeOnSpill={true}
              //
              className='min-h-[200px]'
            >
              {delete2.map(item => {
                return (
                  <li key={item.id} className='mb-2.5 cursor-grab'>
                    <div className='items-md-center border-white-light dark:border-dark flex flex-col rounded-md border bg-white px-6 py-3.5 md:flex-row ltr:text-left rtl:text-right dark:bg-[#1b2e4b]'>
                      <div className='ltr:sm:mr-4 rtl:sm:ml-4'>
                        <Image
                          alt='avatar'
                          src={`/assets/images/profile-${item.id}.jpeg`}
                          className='mx-auto h-11 w-11 rounded-full'
                          width={44}
                          height={44}
                        />
                      </div>
                      <div className='flex flex-1 flex-col items-center justify-between text-center md:flex-row md:text-left'>
                        <div className='my-3 font-semibold md:my-0'>
                          <div className='text-dark text-base dark:text-[#bfc9d4]'>
                            {item.text}
                          </div>
                          <div className='text-white-dark text-xs'>
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ReactSortable>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComponentsDragndropDelete;
