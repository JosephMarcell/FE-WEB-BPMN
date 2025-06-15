'use client';

import { Tab } from '@headlessui/react';
import React, { useState } from 'react';
import { BsSliders } from 'react-icons/bs';
import { FaClock, FaCog } from 'react-icons/fa';
import { RiSensorFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { IRootState } from '@/store';

import ScheduleThresholds from './schedule-thresholds';
import SensorConfigForm from './sensor-config-form';

// Define proper TypeScript interfaces
interface ParameterValue {
  value: number;
  min: number;
  max: number;
  critical_min: number;
  critical_max: number;
}

interface Parameters {
  [paramName: string]: ParameterValue; // Add index signature here
  pH: ParameterValue;
  DO: ParameterValue;
  Turbidity: ParameterValue;
  Conductivity: ParameterValue;
  Temperature: ParameterValue;
  TDS: ParameterValue;
}

interface Sensor {
  id: string;
  name: string;
  location: string;
  status: string;
  type: string;
  parameters: Parameters;
  lastCalibration: string;
  maintenanceSchedule: string;
  reportingInterval: number;
}

// Dummy data for sensors
const dummySensors: Sensor[] = [
  {
    id: 'sensor-001',
    name: 'Sensor 001',
    location: 'Kali Mas, Surabaya',
    status: 'Active',
    type: 'Water Quality',
    parameters: {
      pH: {
        value: 7.2,
        min: 6.5,
        max: 8.5,
        critical_min: 6.0,
        critical_max: 9.0,
      },
      DO: {
        value: 6.8,
        min: 5.0,
        max: 8.0,
        critical_min: 4.0,
        critical_max: 9.0,
      },
      Turbidity: {
        value: 2.5,
        min: 0,
        max: 5.0,
        critical_min: 0,
        critical_max: 10.0,
      },
      Conductivity: {
        value: 350,
        min: 200,
        max: 500,
        critical_min: 100,
        critical_max: 800,
      },
      Temperature: {
        value: 27.5,
        min: 25,
        max: 30,
        critical_min: 22,
        critical_max: 35,
      },
      TDS: {
        value: 500,
        min: 300,
        max: 600,
        critical_min: 200,
        critical_max: 800,
      },
    },
    lastCalibration: '2025-04-15',
    maintenanceSchedule: '2025-06-15',
    reportingInterval: 15,
  },
  {
    id: 'sensor-002',
    name: 'Sensor 002',
    location: 'Rungkut, Surabaya',
    status: 'Warning',
    type: 'Water Quality',
    parameters: {
      pH: {
        value: 8.1,
        min: 6.5,
        max: 8.5,
        critical_min: 6.0,
        critical_max: 9.0,
      },
      DO: {
        value: 5.9,
        min: 5.0,
        max: 8.0,
        critical_min: 4.0,
        critical_max: 9.0,
      },
      Turbidity: {
        value: 3.5,
        min: 0,
        max: 5.0,
        critical_min: 0,
        critical_max: 10.0,
      },
      Conductivity: {
        value: 420,
        min: 200,
        max: 500,
        critical_min: 100,
        critical_max: 800,
      },
      Temperature: {
        value: 29.1,
        min: 25,
        max: 30,
        critical_min: 22,
        critical_max: 35,
      },
      TDS: {
        value: 550,
        min: 300,
        max: 600,
        critical_min: 200,
        critical_max: 800,
      },
    },
    lastCalibration: '2025-03-28',
    maintenanceSchedule: '2025-05-28',
    reportingInterval: 10,
  },
  {
    id: 'sensor-003',
    name: 'Sensor 003',
    location: 'Kenjeran, Surabaya',
    status: 'Offline',
    type: 'Water Quality',
    parameters: {
      pH: {
        value: 7.0,
        min: 6.5,
        max: 8.5,
        critical_min: 6.0,
        critical_max: 9.0,
      },
      DO: {
        value: 7.0,
        min: 5.0,
        max: 8.0,
        critical_min: 4.0,
        critical_max: 9.0,
      },
      Turbidity: {
        value: 1.8,
        min: 0,
        max: 5.0,
        critical_min: 0,
        critical_max: 10.0,
      },
      Conductivity: {
        value: 320,
        min: 200,
        max: 500,
        critical_min: 100,
        critical_max: 800,
      },
      Temperature: {
        value: 26.7,
        min: 25,
        max: 30,
        critical_min: 22,
        critical_max: 35,
      },
      TDS: {
        value: 450,
        min: 300,
        max: 600,
        critical_min: 200,
        critical_max: 800,
      },
    },
    lastCalibration: '2025-04-02',
    maintenanceSchedule: '2025-06-02',
    reportingInterval: 30,
  },
];

const SensorConfigurationMain = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>(dummySensors);

  const updateSensorConfig = (sensorId: string, newConfig: Partial<Sensor>) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensor.id === sensorId ? { ...sensor, ...newConfig } : sensor,
      ),
    );
  };

  const updateSensorParameters = (
    sensorId: string,
    paramName: string,
    values: Partial<ParameterValue>,
  ) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensor.id === sensorId
          ? {
              ...sensor,
              parameters: {
                ...sensor.parameters,
                [paramName]: {
                  ...sensor.parameters[paramName],
                  ...values,
                },
              },
            }
          : sensor,
      ),
    );
  };

  const updateMultipleSensors = (
    sensorIds: string[],
    updates: Partial<Sensor>,
  ) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensorIds.includes(sensor.id) ? { ...sensor, ...updates } : sensor,
      ),
    );
  };

  const updateMultipleSensorParameters = (
    sensorIds: string[],
    paramName: string,
    values: Partial<ParameterValue>,
  ) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensorIds.includes(sensor.id)
          ? {
              ...sensor,
              parameters: {
                ...sensor.parameters,
                [paramName]: {
                  ...sensor.parameters[paramName],
                  ...values,
                },
              },
            }
          : sensor,
      ),
    );
  };

  return (
    <div className='mt-6'>
      <div className='mb-6 grid gap-6'>
        <div className='panel'>
          <div className='mb-5 flex items-center justify-between'>
            <h5 className='dark:text-white-light text-lg font-semibold'>
              <RiSensorFill
                className='text-primary mr-2 inline-block'
                size={20}
              />
              Sensor Configuration
            </h5>
            <div className='relative'>
              <span className='badge bg-primary absolute -right-2 -top-2'>
                {sensors.length}
              </span>
              <BsSliders className='text-primary' size={20} />
            </div>
          </div>
          <div className='mb-5'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Configure your water quality sensors, set thresholds, and schedule
              parameter changes.
            </p>
          </div>

          <Tab.Group>
            <Tab.List className='border-white-light mt-3 flex flex-wrap border-b dark:border-[#191e3a]'>
              <Tab as={React.Fragment}>
                {({ selected }) => (
                  <button
                    className={`hover:text-primary dark:hover:text-primary flex items-center border-b border-transparent p-3.5 py-2 ${
                      selected
                        ? '!border-primary text-primary dark:!border-primary dark:!text-primary !outline-none'
                        : ''
                    }`}
                  >
                    <FaCog className='ltr:mr-2 rtl:ml-2' />
                    <span>Sensor Settings</span>
                  </button>
                )}
              </Tab>
              <Tab as={React.Fragment}>
                {({ selected }) => (
                  <button
                    className={`hover:text-primary dark:hover:text-primary flex items-center border-b border-transparent p-3.5 py-2 ${
                      selected
                        ? '!border-primary text-primary dark:!border-primary dark:!text-primary !outline-none'
                        : ''
                    }`}
                  >
                    <FaClock className='ltr:mr-2 rtl:ml-2' />
                    <span>Schedule Changes</span>
                  </button>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels className='pt-5'>
              <Tab.Panel>
                <SensorConfigForm
                  sensors={sensors}
                  updateSensorConfig={updateSensorConfig}
                />
              </Tab.Panel>
              <Tab.Panel>
                <ScheduleThresholds
                  sensors={sensors}
                  updateSensorParameters={updateSensorParameters}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default SensorConfigurationMain;
