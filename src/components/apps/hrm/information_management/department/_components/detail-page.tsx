import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react';

import { useGetAllPosition } from '@/app/api/hooks/hrm/position/useGetAllPosition';
import { DepartmentProperty } from '@/helpers/utils/hrm/department';

interface IDepartmentDetail {
  data: DepartmentProperty;
}

interface Position {
  pkid: number;
  department_id: number;
  name: string;
}

const DepartmentDetailComponent = ({ data }: IDepartmentDetail) => {
  const { data: listPosition } = useGetAllPosition();

  const filteredPositions = listPosition?.data.filter(
    (position: Position) => position.department_id === data.pkid,
  );

  return (
    <div className='panel border-white-light h-full gap-5 space-y-5 px-5'>
      <Tab.Group>
        <Tab.List className='border-white-light mt-3 flex flex-wrap border-b dark:border-[#191e3a]'>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                type='button'
                className={`${
                  selected
                    ? '!border-white-light text-primary !border-b-white !outline-none dark:!border-[#191e3a] dark:!border-b-black'
                    : ''
                } hover:text-primary -mb-[1px] block border border-transparent p-3.5 py-2 dark:hover:border-b-black`}
              >
                Information of Department
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className='text-sm'>
          <Tab.Panel>
            <div className='active pt-5'>
              <div className='space-y-5'>
                <div>
                  <label htmlFor='name'>Nama</label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    placeholder='Nama'
                    className='form-input'
                    value={data.name || ''}
                    disabled
                  />
                </div>
                <div>
                  <label>Positions</label>
                  {filteredPositions && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label>Position ID</label>
                      </div>
                      <div>
                        <label>Position Name</label>
                      </div>
                      {filteredPositions.map((position: Position) => (
                        <Fragment key={position.pkid}>
                          <div>
                            <input
                              id={`position_id_${position.pkid}`}
                              name={`position_id_${position.pkid}`}
                              type='text'
                              placeholder='Position ID'
                              className='form-input'
                              value={position.pkid}
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              id={`position_name_${position.pkid}`}
                              name={`position_name_${position.pkid}`}
                              type='text'
                              placeholder='Position Name'
                              className='form-input'
                              value={position.name}
                              disabled
                            />
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>Disabled</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default DepartmentDetailComponent;
