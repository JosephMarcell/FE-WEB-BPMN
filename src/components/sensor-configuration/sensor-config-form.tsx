import React, { useState } from 'react';
import { MdEdit, MdSave } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';

interface SensorConfigFormProps {
  sensors: any[];
  updateSensorConfig: (sensorId: string, newConfig: any) => void;
}

const SensorConfigForm: React.FC<SensorConfigFormProps> = ({
  sensors,
  updateSensorConfig,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    type: '',
    reportingInterval: 0,
    lastCalibration: '',
    maintenanceSchedule: '',
  });

  const handleSensorChange = (option: any) => {
    if (!option) {
      setSelectedSensor('');
      return;
    }

    const sensorId = option.value;
    setSelectedSensor(sensorId);

    const sensor = sensors.find(s => s.id === sensorId);
    if (sensor) {
      setForm({
        name: sensor.name,
        location: sensor.location,
        type: sensor.type,
        reportingInterval: sensor.reportingInterval,
        lastCalibration: sensor.lastCalibration,
        maintenanceSchedule: sensor.maintenanceSchedule,
      });
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (!selectedSensor) return;

    updateSensorConfig(selectedSensor, form);

    Swal.fire({
      title: 'Success',
      text: 'Sensor configuration updated successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });

    setEditMode(false);
  };

  const sensorOptions = sensors.map(sensor => ({
    value: sensor.id,
    label: `${sensor.name} (${sensor.location})`,
  }));

  const selectedSensorData = sensors.find(s => s.id === selectedSensor);

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <label htmlFor='sensor-select' className='mb-2 block font-semibold'>
          Select Sensor
        </label>
        <Select
          id='sensor-select'
          options={sensorOptions}
          isClearable
          placeholder='Select a sensor to configure...'
          className='react-select'
          onChange={handleSensorChange}
        />
      </div>

      {selectedSensor && selectedSensorData && (
        <div className='rounded-lg border bg-white p-4 dark:bg-gray-900'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Sensor Details</h2>
            <button
              type='button'
              className={`btn ${
                editMode ? 'btn-success' : 'btn-primary'
              } btn-sm flex items-center gap-2`}
              onClick={() => {
                if (editMode) {
                  handleSaveChanges();
                } else {
                  setEditMode(true);
                }
              }}
            >
              {editMode ? (
                <>
                  <MdSave size={16} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <MdEdit size={16} />
                  <span>Edit Configuration</span>
                </>
              )}
            </button>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Sensor Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  className='form-input mt-1'
                  value={form.name}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>

              <div>
                <label
                  htmlFor='location'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Location
                </label>
                <input
                  id='location'
                  name='location'
                  type='text'
                  className='form-input mt-1'
                  value={form.location}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>

              <div>
                <label
                  htmlFor='type'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Sensor Type
                </label>
                <select
                  id='type'
                  name='type'
                  className='form-select mt-1 w-full'
                  value={form.type}
                  onChange={handleFormChange}
                  disabled={!editMode}
                >
                  <option value='Water Quality'>Water Quality</option>
                  <option value='Temperature'>Temperature</option>
                  <option value='pH'>pH</option>
                  <option value='Multi-parameter'>Multi-parameter</option>
                </select>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='reportingInterval'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Reporting Interval (minutes)
                </label>
                <input
                  id='reportingInterval'
                  name='reportingInterval'
                  type='number'
                  className='form-input mt-1'
                  value={form.reportingInterval}
                  onChange={handleFormChange}
                  disabled={!editMode}
                  min='1'
                />
              </div>

              <div>
                <label
                  htmlFor='lastCalibration'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Last Calibration Date
                </label>
                <input
                  id='lastCalibration'
                  name='lastCalibration'
                  type='date'
                  className='form-input mt-1'
                  value={form.lastCalibration}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>

              <div>
                <label
                  htmlFor='maintenanceSchedule'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Next Maintenance Date
                </label>
                <input
                  id='maintenanceSchedule'
                  name='maintenanceSchedule'
                  type='date'
                  className='form-input mt-1'
                  value={form.maintenanceSchedule}
                  onChange={handleFormChange}
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>

          <div className='mt-6'>
            <h3 className='text-md mb-3 font-semibold'>
              Current Sensor Status
            </h3>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
              <div className='flex items-center justify-between rounded border bg-gray-50 p-3 dark:bg-gray-800'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Status
                </span>
                <span
                  className={`badge ${
                    selectedSensorData.status === 'Active'
                      ? 'bg-success'
                      : selectedSensorData.status === 'Warning'
                      ? 'bg-warning'
                      : 'bg-gray-500'
                  }`}
                >
                  {selectedSensorData.status}
                </span>
              </div>

              {Object.entries(selectedSensorData.parameters).map(
                ([param, data]: [string, any]) => (
                  <div
                    key={param}
                    className='flex items-center justify-between rounded border bg-gray-50 p-3 dark:bg-gray-800'
                  >
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      {param}
                    </span>
                    <span className='font-medium'>{data.value}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedSensor && (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='bg-primary/10 mb-4 rounded-full p-4'>
            <MdEdit size={32} className='text-primary' />
          </div>
          <h3 className='mb-2 text-lg font-semibold'>
            Select a Sensor to Configure
          </h3>
          <p className='max-w-md text-gray-500'>
            Choose a sensor from the dropdown above to view and edit its
            configuration settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default SensorConfigForm;
