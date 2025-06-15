import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react';

import { useGetAllEmployee } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';
import { useGetAllPosition } from '@/app/api/hooks/hrm/position/useGetAllPosition';
import { RecruitmentRequestProperty } from '@/helpers/utils/hrm/recruitment_request';

interface Position {
  pkid: number;
  description: string;
}

interface Employee {
  pkid: number;
  req_id: number;
  fullname: string;
}

interface IRecruitmentRequestDetail {
  data: RecruitmentRequestProperty;
}

const RecruitmentRequestDetailComponent = ({
  data,
}: IRecruitmentRequestDetail) => {
  const { data: listPosition } = useGetAllPosition();
  const { data: listEmployee } = useGetAllEmployee();

  // Find the matching position based on pkid
  const filteredPositions = listPosition?.data.filter(
    (position: Position) => position.pkid === data.position_id,
  );

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
                Information of Recruitment Request
              </button>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels className='text-sm'>
          <Tab.Panel>
            <div className='active pt-5'>
              <div className='space-y-5'>
                <div>
                  <label htmlFor='recruitment_req_id'>
                    Recruitment Request ID
                  </label>
                  <input
                    id='recruitment_req_id'
                    name='recruitment_req_id'
                    type='text'
                    placeholder='Recruitment Request ID'
                    className='form-input'
                    value={data.pkid || ''}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor='position'>Position</label>
                  <input
                    id='position'
                    name='position'
                    type='text'
                    placeholder='Position name'
                    className='form-input'
                    value={data.Position?.name || ''}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor='position_description'>Description</label>
                  <input
                    id='position_description'
                    name='position_description'
                    type='text'
                    placeholder='Position Description'
                    className='form-input'
                    value={
                      filteredPositions ? filteredPositions[0].description : ''
                    }
                    disabled
                  />
                </div>
                <div>
                  <label>Employees</label>
                  <div className='grid grid-cols-2 gap-4'>
                    {filteredEmployees?.map(
                      (employee: Employee, index: number) => (
                        <Fragment key={employee.pkid}>
                          <div>
                            {index === 0 && (
                              <label htmlFor={`employee_id_${employee.pkid}`}>
                                Employee ID
                              </label>
                            )}
                            <input
                              id={`employee_id_${employee.pkid}`}
                              name={`employee_id_${employee.pkid}`}
                              type='text'
                              placeholder='Employee ID'
                              className='form-input'
                              value={employee.pkid}
                              disabled
                            />
                          </div>
                          <div>
                            {index === 0 && (
                              <label htmlFor={`employee_name_${employee.pkid}`}>
                                Employee Name
                              </label>
                            )}
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
                      ),
                    )}
                  </div>
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

export default RecruitmentRequestDetailComponent;
