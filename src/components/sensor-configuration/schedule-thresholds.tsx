import React, { useState } from 'react';
import { BsSliders } from 'react-icons/bs';
import {
  FaCalendarAlt,
  FaClock,
  FaRegCalendarPlus,
  FaTrash,
} from 'react-icons/fa';
import { MdSchedule } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';

interface ScheduleThresholdsProps {
  sensors: any[];
  updateSensorParameters: (
    sensorId: string,
    paramName: string,
    values: any,
  ) => void;
}

interface ScheduledChange {
  id: string;
  sensorId: string;
  parameterName: string;
  scheduledDate: string;
  scheduledTime: string;
  thresholds: {
    min?: number;
    max?: number;
    critical_min?: number;
    critical_max?: number;
  };
  isRecurring: boolean;
  recurrencePattern?: string;
}

const ScheduleThresholds: React.FC<ScheduleThresholdsProps> = ({
  sensors,
  updateSensorParameters,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<string>('');
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('12:00');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrencePattern, setRecurrencePattern] = useState<string>('daily');

  const [thresholds, setThresholds] = useState({
    min: '',
    max: '',
    critical_min: '',
    critical_max: '',
  });

  // Store scheduled changes
  const [scheduledChanges, setScheduledChanges] = useState<ScheduledChange[]>(
    [],
  );

  const handleSensorChange = (option: any) => {
    if (!option) {
      setSelectedSensor('');
      setSelectedParameter('');
      return;
    }

    setSelectedSensor(option.value);
    setSelectedParameter('');
  };

  const handleParameterChange = (option: any) => {
    if (!option || !selectedSensor) return;

    const paramName = option.value;
    setSelectedParameter(paramName);

    // Reset thresholds
    setThresholds({
      min: '',
      max: '',
      critical_min: '',
      critical_max: '',
    });
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : '',
    }));
  };

  const handleScheduleChange = () => {
    if (!selectedSensor || !selectedParameter || !scheduledDate) {
      Swal.fire({
        title: 'Incomplete Information',
        text: 'Please select a sensor, parameter, and schedule date',
        icon: 'warning',
      });
      return;
    }

    // Check if any threshold is set
    const hasThresholdChanges =
      thresholds.min !== '' ||
      thresholds.max !== '' ||
      thresholds.critical_min !== '' ||
      thresholds.critical_max !== '';

    if (!hasThresholdChanges) {
      Swal.fire({
        title: 'No Changes Specified',
        text: 'Please specify at least one threshold change',
        icon: 'warning',
      });
      return;
    }

    // Create scheduled change object
    const newScheduledChange: ScheduledChange = {
      id: Date.now().toString(),
      sensorId: selectedSensor,
      parameterName: selectedParameter,
      scheduledDate,
      scheduledTime,
      thresholds: {
        ...(thresholds.min !== '' && {
          min: parseFloat(thresholds.min as any),
        }),
        ...(thresholds.max !== '' && {
          max: parseFloat(thresholds.max as any),
        }),
        ...(thresholds.critical_min !== '' && {
          critical_min: parseFloat(thresholds.critical_min as any),
        }),
        ...(thresholds.critical_max !== '' && {
          critical_max: parseFloat(thresholds.critical_max as any),
        }),
      },
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
    };

    // Add to scheduled changes
    setScheduledChanges(prev => [...prev, newScheduledChange]);

    // Show success message
    Swal.fire({
      title: 'Change Scheduled',
      text: `Threshold changes for ${selectedParameter} will be applied on ${scheduledDate} at ${scheduledTime}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });

    // Reset form
    setThresholds({
      min: '',
      max: '',
      critical_min: '',
      critical_max: '',
    });
  };

  const handleDeleteScheduledChange = (id: string) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this scheduled change?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        setScheduledChanges(prev => prev.filter(change => change.id !== id));
      }
    });
  };

  const sensorOptions = sensors.map(sensor => ({
    value: sensor.id,
    label: `${sensor.name} (${sensor.location})`,
  }));

  const getParameterOptions = () => {
    if (!selectedSensor) return [];

    const sensor = sensors.find(s => s.id === selectedSensor);
    if (!sensor) return [];

    return Object.keys(sensor.parameters).map(param => ({
      value: param,
      label: param,
    }));
  };

  // Get sensor and parameter information for display
  const getSensorName = (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? sensor.name : 'Unknown Sensor';
  };

  const getSensorLocation = (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? sensor.location : 'Unknown Location';
  };

  // Get appropriate status text
  const getRecurrenceText = (change: ScheduledChange) => {
    if (!change.isRecurring) return 'One-time change';

    switch (change.recurrencePattern) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        return 'Repeats weekly';
      case 'monthly':
        return 'Repeats monthly';
      default:
        return 'Recurring';
    }
  };

  // Parameter-specific metadata for display
  const parameterMeta: Record<string, { unit: string }> = {
    pH: { unit: '' },
    DO: { unit: 'mg/L' },
    Turbidity: { unit: 'NTU' },
    Conductivity: { unit: 'µS/cm' },
    Temperature: { unit: '°C' },
    TDS: { unit: 'ppm' },
  };

  const getParamUnit = (paramName: string) => {
    if (!paramName || !parameterMeta[paramName]) return '';
    return parameterMeta[paramName].unit;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Schedule New Changes Panel */}
        <div className='rounded-lg border bg-white p-6 dark:bg-gray-900'>
          <div className='mb-6 flex items-center'>
            <MdSchedule className='text-primary mr-2 text-xl' />
            <h3 className='text-lg font-semibold'>
              Schedule New Threshold Changes
            </h3>
          </div>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='sensor-select'
                className='mb-2 block text-sm font-medium'
              >
                Select Sensor
              </label>
              <Select
                id='sensor-select'
                options={sensorOptions}
                isClearable
                placeholder='Select a sensor...'
                className='react-select'
                onChange={handleSensorChange}
              />
            </div>

            <div>
              <label
                htmlFor='parameter-select'
                className='mb-2 block text-sm font-medium'
              >
                Select Parameter
              </label>
              <Select
                id='parameter-select'
                options={getParameterOptions()}
                isClearable
                isDisabled={!selectedSensor}
                placeholder={
                  selectedSensor
                    ? 'Select a parameter...'
                    : 'Select a sensor first'
                }
                className='react-select'
                onChange={handleParameterChange}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='schedule-date'
                  className='mb-2 block text-sm font-medium'
                >
                  Schedule Date
                </label>
                <input
                  type='date'
                  id='schedule-date'
                  className='form-input'
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>

              <div>
                <label
                  htmlFor='schedule-time'
                  className='mb-2 block text-sm font-medium'
                >
                  Schedule Time
                </label>
                <input
                  type='time'
                  id='schedule-time'
                  className='form-input'
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                />
              </div>
            </div>

            <div className='py-2'>
              <label className='inline-flex cursor-pointer items-center'>
                <input
                  type='checkbox'
                  className='form-checkbox'
                  checked={isRecurring}
                  onChange={() => setIsRecurring(!isRecurring)}
                />
                <span className='ml-2'>Recurring Schedule</span>
              </label>

              {isRecurring && (
                <div className='mt-3 pl-6'>
                  <label
                    htmlFor='recurrence-pattern'
                    className='mb-2 block text-sm font-medium'
                  >
                    Recurrence Pattern
                  </label>
                  <select
                    id='recurrence-pattern'
                    className='form-select'
                    value={recurrencePattern}
                    onChange={e => setRecurrencePattern(e.target.value)}
                  >
                    <option value='daily'>Daily</option>
                    <option value='weekly'>Weekly</option>
                    <option value='monthly'>Monthly</option>
                  </select>
                </div>
              )}
            </div>

            {selectedParameter && (
              <div className='mt-4 border-t pt-4'>
                <h4 className='mb-3 flex items-center font-medium'>
                  <BsSliders className='mr-2' />
                  <span>
                    {selectedParameter} Threshold Changes
                    {getParamUnit(selectedParameter) && (
                      <span className='ml-2 rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700'>
                        {getParamUnit(selectedParameter)}
                      </span>
                    )}
                  </span>
                </h4>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <label
                      htmlFor='min'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Warning Min Threshold
                    </label>
                    <input
                      type='number'
                      id='min'
                      name='min'
                      value={thresholds.min}
                      onChange={handleThresholdChange}
                      step='0.1'
                      className='form-input'
                      placeholder='Leave blank to keep current'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='max'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Warning Max Threshold
                    </label>
                    <input
                      type='number'
                      id='max'
                      name='max'
                      value={thresholds.max}
                      onChange={handleThresholdChange}
                      step='0.1'
                      className='form-input'
                      placeholder='Leave blank to keep current'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='critical_min'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Critical Min Threshold
                    </label>
                    <input
                      type='number'
                      id='critical_min'
                      name='critical_min'
                      value={thresholds.critical_min}
                      onChange={handleThresholdChange}
                      step='0.1'
                      className='form-input'
                      placeholder='Leave blank to keep current'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='critical_max'
                      className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                    >
                      Critical Max Threshold
                    </label>
                    <input
                      type='number'
                      id='critical_max'
                      name='critical_max'
                      value={thresholds.critical_max}
                      onChange={handleThresholdChange}
                      step='0.1'
                      className='form-input'
                      placeholder='Leave blank to keep current'
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='mt-6 flex justify-end'>
              <button
                type='button'
                className='btn btn-primary flex items-center gap-2'
                onClick={handleScheduleChange}
                disabled={
                  !selectedSensor || !selectedParameter || !scheduledDate
                }
              >
                <FaRegCalendarPlus />
                <span>Schedule Change</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Changes Panel */}
        <div className='rounded-lg border bg-white p-6 dark:bg-gray-900'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center'>
              <FaCalendarAlt className='text-primary mr-2 text-xl' />
              <h3 className='text-lg font-semibold'>Scheduled Changes</h3>
            </div>
            <span className='badge bg-primary'>{scheduledChanges.length}</span>
          </div>

          {scheduledChanges.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-center'>
              <div className='mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800'>
                <FaClock className='text-2xl text-gray-400' />
              </div>
              <p className='text-gray-500'>
                No threshold changes scheduled yet
              </p>
              <p className='mt-1 text-sm text-gray-400'>
                Schedule changes on the left panel
              </p>
            </div>
          ) : (
            <div className='max-h-[500px] space-y-3 overflow-y-auto pr-1'>
              {scheduledChanges.map(change => (
                <div
                  key={change.id}
                  className='rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='flex items-center text-sm font-medium'>
                        <span className='bg-primary mr-2 h-2 w-2 rounded-full'></span>
                        {change.parameterName}
                        {getParamUnit(change.parameterName) && (
                          <span className='ml-1 rounded bg-gray-200 px-1 text-xs dark:bg-gray-700'>
                            {getParamUnit(change.parameterName)}
                          </span>
                        )}
                      </h4>
                      <p className='mt-1 text-xs text-gray-500'>
                        {getSensorName(change.sensorId)} -{' '}
                        {getSensorLocation(change.sensorId)}
                      </p>
                    </div>
                    <button
                      type='button'
                      className='text-danger-500 hover:text-danger-700'
                      onClick={() => handleDeleteScheduledChange(change.id)}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
                    <div className='flex items-center'>
                      <FaCalendarAlt className='mr-1 text-gray-400' size={12} />
                      <span>{formatDate(change.scheduledDate)}</span>
                    </div>
                    <div className='flex items-center'>
                      <FaClock className='mr-1 text-gray-400' size={12} />
                      <span>{change.scheduledTime}</span>
                    </div>
                  </div>

                  <div className='mt-3 text-xs'>
                    <p className='italic text-gray-500'>
                      {getRecurrenceText(change)}
                    </p>
                  </div>

                  <div className='mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs'>
                    {change.thresholds.min !== undefined && (
                      <div className='flex justify-between'>
                        <span className='text-gray-500'>Warning Min:</span>
                        <span className='font-medium'>
                          {change.thresholds.min}
                        </span>
                      </div>
                    )}

                    {change.thresholds.max !== undefined && (
                      <div className='flex justify-between'>
                        <span className='text-gray-500'>Warning Max:</span>
                        <span className='font-medium'>
                          {change.thresholds.max}
                        </span>
                      </div>
                    )}

                    {change.thresholds.critical_min !== undefined && (
                      <div className='flex justify-between'>
                        <span className='text-gray-500'>Critical Min:</span>
                        <span className='font-medium'>
                          {change.thresholds.critical_min}
                        </span>
                      </div>
                    )}

                    {change.thresholds.critical_max !== undefined && (
                      <div className='flex justify-between'>
                        <span className='text-gray-500'>Critical Max:</span>
                        <span className='font-medium'>
                          {change.thresholds.critical_max}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleThresholds;
