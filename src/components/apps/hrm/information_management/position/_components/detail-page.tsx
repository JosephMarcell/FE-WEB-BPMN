import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react';

import { useGetAllEmployee } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { PositionProperty } from '@/helpers/utils/hrm/position';

interface IPositionDetail {
  data: PositionProperty;
}

interface Employee {
  pkid: number;
  req_id: number;
  fullname: string;
}

const DepartmentDetailComponent = ({ data }: IPositionDetail) => {
  const { data: listEmployee } = useGetAllEmployee();

  const filteredEmployees = listEmployee?.data.filter(
    (employee: Employee) => employee.req_id === data.pkid,
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
                Information of Position
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className='text-sm'>
          <Tab.Panel>
            <div className='active pt-5'>
              <div className='space-y-5'>
                {/* <div>
                  <label htmlFor='name'>ID</label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    placeholder='Nama'
                    className='form-input'
                    value={data.pkid || ''}
                    disabled
                  />
                </div> */}
                <div>
                  <label htmlFor='name'>Name</label>
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
                  <label>Employees</label>
                  {filteredEmployees && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label>Employee ID</label>
                      </div>
                      <div>
                        <label>Employee Name</label>
                      </div>
                      {filteredEmployees.map((employee: Employee) => (
                        <Fragment key={employee.pkid}>
                          <div>
                            <input
                              id={`employee_id_${employee.pkid}`}
                              name={`employee_id_${employee.pkid}`}
                              type='number'
                              placeholder='Employee ID'
                              className='form-input'
                              value={employee.pkid}
                              disabled
                            />
                          </div>
                          <div>
                            <input
                              id={`employee_name_${employee.pkid}`}
                              name={`employee_name_${employee.pkid}`}
                              type='text'
                              placeholder='Employee Name'
                              className='form-input'
                              value={employee.fullname}
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
