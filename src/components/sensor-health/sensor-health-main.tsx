'use client';

import type { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import Flatpickr from 'react-flatpickr';
import {
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaServer,
  FaSyncAlt,
} from 'react-icons/fa';
import {
  MdSignalCellular2Bar,
  MdSignalCellular4Bar,
  MdSignalCellularNull,
  MdSpeed,
  MdTimeline,
} from 'react-icons/md';
import { RiSensorFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import 'react-circular-progressbar/dist/styles.css';
import 'flatpickr/dist/flatpickr.css';

import Dropdown from '@/components/dropdown';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';

import { IRootState } from '@/store';

// Dummy sensor data
const sensorHealthData = [
  {
    id: 'sensor-001',
    name: 'Sensor 001',
    location: 'Kali Mas, Surabaya',
    lastConnected: '2025-05-17T14:30:00',
    batteryLevel: 85,
    signalStrength: 90,
    status: 'Active',
    uptime: 99.8,
    firmware: 'v2.3.4',
    latency: 120, // in ms
    errorRate: 0.05, // percentage
    temperatureInternal: 35.2, // in celsius
    connectionHistory: [
      { date: '2025-05-10', status: 'Connected', uptime: 99.7 },
      { date: '2025-05-11', status: 'Connected', uptime: 99.9 },
      { date: '2025-05-12', status: 'Connected', uptime: 100.0 },
      { date: '2025-05-13', status: 'Disconnected', uptime: 87.5 },
      { date: '2025-05-14', status: 'Connected', uptime: 98.2 },
      { date: '2025-05-15', status: 'Connected', uptime: 99.5 },
      { date: '2025-05-16', status: 'Connected', uptime: 99.8 },
      { date: '2025-05-17', status: 'Connected', uptime: 99.9 },
    ],
    batteryHistory: [95, 92, 90, 88, 87, 86, 85, 85],
    signalHistory: [85, 88, 92, 89, 91, 87, 90, 90],
    maintenanceHistory: [
      { date: '2025-04-15', type: 'Calibration', technician: 'John Doe' },
      {
        date: '2025-03-01',
        type: 'Battery Replacement',
        technician: 'Jane Smith',
      },
      { date: '2025-01-15', type: 'Firmware Update', technician: 'John Doe' },
    ],
    alerts: [
      {
        date: '2025-05-14T08:30:00',
        type: 'Disconnection',
        message: 'Sensor disconnected for 30 minutes',
      },
      {
        date: '2025-05-13T14:45:00',
        type: 'Battery',
        message: 'Battery level dropped below 90%',
      },
    ],
  },
  {
    id: 'sensor-002',
    name: 'Sensor 002',
    location: 'Rungkut, Surabaya',
    lastConnected: '2025-05-17T14:25:00',
    batteryLevel: 62,
    signalStrength: 70,
    status: 'Warning',
    uptime: 95.4,
    firmware: 'v2.3.4',
    latency: 180, // in ms
    errorRate: 1.2, // percentage
    temperatureInternal: 38.5, // in celsius
    connectionHistory: [
      { date: '2025-05-10', status: 'Connected', uptime: 98.5 },
      { date: '2025-05-11', status: 'Connected', uptime: 97.2 },
      { date: '2025-05-12', status: 'Disconnected', uptime: 85.5 },
      { date: '2025-05-13', status: 'Connected', uptime: 94.8 },
      { date: '2025-05-14', status: 'Connected', uptime: 96.2 },
      { date: '2025-05-15', status: 'Warning', uptime: 93.5 },
      { date: '2025-05-16', status: 'Warning', uptime: 94.8 },
      { date: '2025-05-17', status: 'Warning', uptime: 95.4 },
    ],
    batteryHistory: [75, 72, 70, 68, 66, 64, 63, 62],
    signalHistory: [65, 68, 72, 74, 71, 69, 70, 70],
    maintenanceHistory: [
      { date: '2025-03-20', type: 'Calibration', technician: 'Jane Smith' },
      { date: '2025-02-05', type: 'Sensor Cleaning', technician: 'John Doe' },
    ],
    alerts: [
      {
        date: '2025-05-16T10:15:00',
        type: 'Performance',
        message: 'High latency detected (>150ms)',
      },
      {
        date: '2025-05-15T16:20:00',
        type: 'Signal',
        message: 'Weak signal strength (<75%)',
      },
      {
        date: '2025-05-12T09:45:00',
        type: 'Disconnection',
        message: 'Sensor disconnected for 3.5 hours',
      },
    ],
  },
  {
    id: 'sensor-003',
    name: 'Sensor 003',
    location: 'Kenjeran, Surabaya',
    lastConnected: '2025-05-16T22:10:00',
    batteryLevel: 23,
    signalStrength: 30,
    status: 'Offline',
    uptime: 68.2,
    firmware: 'v2.3.3',
    latency: 250, // in ms
    errorRate: 4.8, // percentage
    temperatureInternal: 32.4, // in celsius
    connectionHistory: [
      { date: '2025-05-10', status: 'Warning', uptime: 92.5 },
      { date: '2025-05-11', status: 'Warning', uptime: 91.2 },
      { date: '2025-05-12', status: 'Warning', uptime: 88.5 },
      { date: '2025-05-13', status: 'Warning', uptime: 85.8 },
      { date: '2025-05-14', status: 'Disconnected', uptime: 45.2 },
      { date: '2025-05-15', status: 'Connected', uptime: 89.5 },
      { date: '2025-05-16', status: 'Warning', uptime: 78.8 },
      { date: '2025-05-17', status: 'Offline', uptime: 0 },
    ],
    batteryHistory: [42, 38, 35, 32, 30, 28, 25, 23],
    signalHistory: [45, 42, 40, 38, 35, 32, 30, 30],
    maintenanceHistory: [
      { date: '2025-02-10', type: 'Calibration', technician: 'John Doe' },
      {
        date: '2024-12-05',
        type: 'Housing Replacement',
        technician: 'Jane Smith',
      },
    ],
    alerts: [
      {
        date: '2025-05-17T00:10:00',
        type: 'Critical',
        message: 'Sensor went offline',
      },
      {
        date: '2025-05-16T22:05:00',
        type: 'Battery',
        message: 'Battery level critically low (<25%)',
      },
      {
        date: '2025-05-16T18:30:00',
        type: 'Signal',
        message: 'Very weak signal strength (<35%)',
      },
      {
        date: '2025-05-14T10:45:00',
        type: 'Disconnection',
        message: 'Sensor disconnected for 12 hours',
      },
    ],
  },
];

const SensorHealthMain = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date('2025-05-10'),
    new Date('2025-05-17'),
  ]);

  // Active tab for sensor detail
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'maintenance'
  >('overview');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter sensors based on selection
  const filteredSensors =
    selectedSensor === 'all'
      ? sensorHealthData
      : sensorHealthData.filter(s => s.id === selectedSensor);

  // Get one sensor data for detailed view
  const activeSensor = filteredSensors.length === 1 ? filteredSensors[0] : null;

  // Count sensors by status
  const sensorCounts = {
    total: sensorHealthData.length,
    active: sensorHealthData.filter(s => s.status === 'Active').length,
    warning: sensorHealthData.filter(s => s.status === 'Warning').length,
    offline: sensorHealthData.filter(s => s.status === 'Offline').length,
  };

  // Helper function for battery icon
  const getBatteryIcon = (level: number) => {
    if (level > 70)
      return <FaBatteryFull className='text-green-500' size={24} />;
    if (level > 30)
      return <FaBatteryHalf className='text-yellow-500' size={24} />;
    return <FaBatteryQuarter className='text-red-500' size={24} />;
  };

  // Helper function for signal icon
  const getSignalIcon = (strength: number) => {
    if (strength > 70)
      return <MdSignalCellular4Bar className='text-green-500' size={24} />;
    if (strength > 30)
      return <MdSignalCellular2Bar className='text-yellow-500' size={24} />;
    return <MdSignalCellularNull className='text-red-500' size={24} />;
  };

  // Helper for alert count
  const getTotalAlerts = () => {
    return filteredSensors.reduce(
      (sum, sensor) => sum + sensor.alerts.length,
      0,
    );
  };

  // Connection history chart options
  const connectionHistoryChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'category',
      categories: activeSensor?.connectionHistory.map(item => item.date) || [],
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Uptime (%)',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    colors: ['#4361ee'],
  };

  const connectionHistorySeries = [
    {
      name: 'Daily Uptime',
      data: activeSensor?.connectionHistory.map(item => item.uptime) || [],
    },
  ];

  // Battery and Signal chart options
  const batterySignalChartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      categories: activeSensor?.connectionHistory.map(item => item.date) || [],
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Level (%)',
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#00ab55', '#1e90ff'],
  };

  const batterySignalSeries = [
    {
      name: 'Battery',
      data: activeSensor?.batteryHistory || [],
    },
    {
      name: 'Signal',
      data: activeSensor?.signalHistory || [],
    },
  ];

  // Export function (dummy)
  const handleExport = (type: string) => {
    // In real implementation, call API to export data
    alert(
      `Exporting ${type} report for ${
        selectedSensor === 'all' ? 'all sensors' : activeSensor?.name
      }`,
    );
  };

  return (
    <div className='mt-6'>
      {/* Page Header */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center justify-between'>
          <h2 className='dark:text-white-light flex items-center text-2xl font-bold'>
            <RiSensorFill className='text-primary mr-2' size={28} />
            Sensor Health Monitoring
          </h2>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => handleExport('pdf')}
              className='btn btn-outline-primary btn-sm flex items-center'
            >
              <FaDownload className='mr-1' /> Export Report
            </button>
          </div>
        </div>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Monitor sensor health, connectivity, battery status, and diagnostic
          information
        </p>
      </div>

      {/* Filter Section */}
      <div className='mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900'>
        <div className='flex items-center gap-2'>
          <label
            htmlFor='sensor-select'
            className='whitespace-nowrap text-sm font-medium'
          >
            Sensor:
          </label>
          <select
            id='sensor-select'
            className='form-select min-w-[150px] rounded-md text-sm'
            value={selectedSensor}
            onChange={e => setSelectedSensor(e.target.value)}
          >
            <option value='all'>All Sensors</option>
            {sensorHealthData.map(sensor => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name} ({sensor.location})
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <label className='flex items-center whitespace-nowrap text-sm font-medium'>
            <FaCalendarAlt className='mr-1' /> Date Range:
          </label>
          <div className='relative'>
            <Flatpickr
              options={{
                mode: 'range',
                dateFormat: 'Y-m-d',
                defaultDate: dateRange,
              }}
              value={dateRange}
              className='form-input py-2 pl-8 pr-4'
              placeholder='Select date range'
            />
            <FaCalendarAlt className='absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400' />
          </div>
        </div>
      </div>

      {/* Health Status Overview Cards */}
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-4'>
        <div
          className={`panel flex items-center p-4 ${
            sensorCounts.active > 0
              ? 'border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className='mr-3 flex-shrink-0 rounded-full bg-green-500/20 p-3'>
            <RiSensorFill className='text-green-500' size={24} />
          </div>
          <div>
            <h3 className='text-lg font-bold'>{sensorCounts.active}</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Active Sensors
            </p>
          </div>
        </div>

        <div
          className={`panel flex items-center p-4 ${
            sensorCounts.warning > 0
              ? 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className='mr-3 flex-shrink-0 rounded-full bg-yellow-500/20 p-3'>
            <FaExclamationTriangle className='text-yellow-500' size={24} />
          </div>
          <div>
            <h3 className='text-lg font-bold'>{sensorCounts.warning}</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Warning State
            </p>
          </div>
        </div>

        <div
          className={`panel flex items-center p-4 ${
            sensorCounts.offline > 0
              ? 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className='mr-3 flex-shrink-0 rounded-full bg-red-500/20 p-3'>
            <FaServer className='text-red-500' size={24} />
          </div>
          <div>
            <h3 className='text-lg font-bold'>{sensorCounts.offline}</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Offline Sensors
            </p>
          </div>
        </div>

        <div
          className={`panel flex items-center p-4 ${
            getTotalAlerts() > 0
              ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'bg-white dark:bg-gray-900'
          }`}
        >
          <div className='mr-3 flex-shrink-0 rounded-full bg-blue-500/20 p-3'>
            <FaExchangeAlt className='text-blue-500' size={24} />
          </div>
          <div>
            <h3 className='text-lg font-bold'>{getTotalAlerts()}</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Active Alerts
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Sensor List Panel */}
        <div className='panel xl:col-span-1'>
          <div className='mb-5 flex items-center justify-between'>
            <h5 className='flex items-center text-lg font-semibold'>
              <FaServer className='text-primary mr-2' /> Sensor Health Status
            </h5>
            <span className='badge bg-primary'>{filteredSensors.length}</span>
          </div>

          <div className='max-h-[600px] space-y-4 overflow-y-auto pr-1'>
            {filteredSensors.map(sensor => (
              <div
                key={sensor.id}
                className={`cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md ${
                  sensor.status === 'Active'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : sensor.status === 'Warning'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                } ${selectedSensor === sensor.id ? 'ring-primary ring-2' : ''}`}
                onClick={() => setSelectedSensor(sensor.id)}
              >
                <div className='flex justify-between'>
                  <div>
                    <h6 className='font-semibold'>{sensor.name}</h6>
                    <p className='text-xs text-gray-500'>{sensor.location}</p>
                  </div>
                  <span
                    className={`badge ${
                      sensor.status === 'Active'
                        ? 'bg-success'
                        : sensor.status === 'Warning'
                        ? 'bg-warning'
                        : 'bg-danger'
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>

                <div className='mt-3 grid grid-cols-2 gap-3'>
                  <div className='flex items-center'>
                    {getBatteryIcon(sensor.batteryLevel)}
                    <div className='ml-2'>
                      <span className='text-xs text-gray-500'>Battery</span>
                      <p className='text-sm font-medium'>
                        {sensor.batteryLevel}%
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    {getSignalIcon(sensor.signalStrength)}
                    <div className='ml-2'>
                      <span className='text-xs text-gray-500'>Signal</span>
                      <p className='text-sm font-medium'>
                        {sensor.signalStrength}%
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <FaSyncAlt
                      className={`${
                        sensor.uptime > 95
                          ? 'text-green-500'
                          : sensor.uptime > 80
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                      size={18}
                    />
                    <div className='ml-2'>
                      <span className='text-xs text-gray-500'>Uptime</span>
                      <p className='text-sm font-medium'>{sensor.uptime}%</p>
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <FaChartLine
                      className={`${
                        sensor.errorRate < 0.5
                          ? 'text-green-500'
                          : sensor.errorRate < 2
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                      size={18}
                    />
                    <div className='ml-2'>
                      <span className='text-xs text-gray-500'>Error Rate</span>
                      <p className='text-sm font-medium'>{sensor.errorRate}%</p>
                    </div>
                  </div>
                </div>

                {sensor.alerts.length > 0 && (
                  <div className='mt-3 rounded bg-red-100 p-2 text-xs dark:bg-red-900/30'>
                    <p className='font-semibold text-red-700 dark:text-red-400'>
                      {sensor.alerts.length} active{' '}
                      {sensor.alerts.length === 1 ? 'alert' : 'alerts'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Detail Panel */}
        <div className='panel xl:col-span-2'>
          {activeSensor ? (
            <>
              <div className='mb-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h5 className='text-lg font-semibold'>
                      {activeSensor.name} - Health Details
                    </h5>
                    <p className='text-xs text-gray-500'>
                      {activeSensor.location}
                    </p>
                  </div>

                  <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    button={
                      <IconHorizontalDots className='hover:!text-primary text-black/70 dark:text-white/70' />
                    }
                  >
                    <ul>
                      <li>
                        <button
                          type='button'
                          onClick={() => handleExport('csv')}
                        >
                          Export CSV
                        </button>
                      </li>
                      <li>
                        <button
                          type='button'
                          onClick={() => handleExport('pdf')}
                        >
                          Export PDF
                        </button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>

                {/* Navigation tabs for sensor details */}
                <div className='mt-4 flex border-b border-gray-200 dark:border-gray-700'>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'overview'
                        ? 'text-primary border-primary border-b-2'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'timeline'
                        ? 'text-primary border-primary border-b-2'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('timeline')}
                  >
                    Connection Timeline
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'maintenance'
                        ? 'text-primary border-primary border-b-2'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('maintenance')}
                  >
                    Maintenance
                  </button>
                </div>
              </div>

              {/* Tab content */}
              {activeTab === 'overview' && (
                <>
                  {/* Status Cards - Battery & Signal */}
                  <div className='mb-6 grid grid-cols-2 gap-4'>
                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <h6 className='mb-3 text-sm font-medium text-gray-500'>
                        Battery Status
                      </h6>
                      <div className='flex items-center'>
                        <div className='h-20 w-20'>
                          <CircularProgressbar
                            value={activeSensor.batteryLevel}
                            text={`${activeSensor.batteryLevel}%`}
                            styles={buildStyles({
                              pathColor:
                                activeSensor.batteryLevel > 70
                                  ? '#10B981'
                                  : activeSensor.batteryLevel > 30
                                  ? '#F59E0B'
                                  : '#EF4444',
                              textColor: isDark ? '#fff' : '#000',
                              trailColor: isDark ? '#374151' : '#F3F4F6',
                              textSize: '22px',
                            })}
                          />
                        </div>
                        <div className='ml-6'>
                          <div className='mb-1 text-xs text-gray-500'>
                            Status
                          </div>
                          <div
                            className={`font-medium ${
                              activeSensor.batteryLevel > 70
                                ? 'text-green-600'
                                : activeSensor.batteryLevel > 30
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {activeSensor.batteryLevel > 70
                              ? 'Good'
                              : activeSensor.batteryLevel > 30
                              ? 'Warning'
                              : 'Critical'}
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            Estimated Remaining
                          </div>
                          <div className='font-medium'>
                            {activeSensor.batteryLevel > 70
                              ? '~ 2.5 months'
                              : activeSensor.batteryLevel > 30
                              ? '~ 3 weeks'
                              : '< 1 week'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <h6 className='mb-3 text-sm font-medium text-gray-500'>
                        Signal Strength
                      </h6>
                      <div className='flex items-center'>
                        <div className='h-20 w-20'>
                          <CircularProgressbar
                            value={activeSensor.signalStrength}
                            text={`${activeSensor.signalStrength}%`}
                            styles={buildStyles({
                              pathColor:
                                activeSensor.signalStrength > 70
                                  ? '#10B981'
                                  : activeSensor.signalStrength > 30
                                  ? '#F59E0B'
                                  : '#EF4444',
                              textColor: isDark ? '#fff' : '#000',
                              trailColor: isDark ? '#374151' : '#F3F4F6',
                              textSize: '22px',
                            })}
                          />
                        </div>
                        <div className='ml-6'>
                          <div className='mb-1 text-xs text-gray-500'>
                            Quality
                          </div>
                          <div
                            className={`font-medium ${
                              activeSensor.signalStrength > 70
                                ? 'text-green-600'
                                : activeSensor.signalStrength > 30
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {activeSensor.signalStrength > 70
                              ? 'Excellent'
                              : activeSensor.signalStrength > 30
                              ? 'Fair'
                              : 'Poor'}
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            Stability
                          </div>
                          <div className='font-medium'>
                            {activeSensor.signalStrength > 70
                              ? 'Stable'
                              : activeSensor.signalStrength > 30
                              ? 'Fluctuating'
                              : 'Unstable'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance metrics */}
                  <div className='mb-6 grid grid-cols-3 gap-4'>
                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <span className='text-xs text-gray-500'>Uptime</span>
                      <div className='flex items-center'>
                        <MdSpeed
                          className={`${
                            activeSensor.uptime > 95
                              ? 'text-green-500'
                              : activeSensor.uptime > 80
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                          size={24}
                        />
                        <span className='ml-2 text-xl font-bold'>
                          {activeSensor.uptime}%
                        </span>
                      </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <span className='text-xs text-gray-500'>Latency</span>
                      <div className='flex items-center'>
                        <FaExchangeAlt
                          className={`${
                            activeSensor.latency < 150
                              ? 'text-green-500'
                              : activeSensor.latency < 200
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                          size={20}
                        />
                        <span className='ml-2 text-xl font-bold'>
                          {activeSensor.latency} ms
                        </span>
                      </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <span className='text-xs text-gray-500'>Error Rate</span>
                      <div className='flex items-center'>
                        <FaChartLine
                          className={`${
                            activeSensor.errorRate < 0.5
                              ? 'text-green-500'
                              : activeSensor.errorRate < 2
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                          size={20}
                        />
                        <span className='ml-2 text-xl font-bold'>
                          {activeSensor.errorRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className='mb-6 grid grid-cols-1'>
                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <h6 className='mb-3 font-medium text-gray-500'>
                        System Information
                      </h6>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <ul className='space-y-2'>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Firmware Version
                              </span>
                              <span className='text-sm font-medium'>
                                {activeSensor.firmware}
                              </span>
                            </li>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Last Connected
                              </span>
                              <span className='text-sm font-medium'>
                                {new Date(
                                  activeSensor.lastConnected,
                                ).toLocaleString()}
                              </span>
                            </li>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Internal Temperature
                              </span>
                              <span className='text-sm font-medium'>
                                {activeSensor.temperatureInternal}°C
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <ul className='space-y-2'>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Last Calibration
                              </span>
                              <span className='text-sm font-medium'>
                                {activeSensor.maintenanceHistory[0]?.date ||
                                  'Unknown'}
                              </span>
                            </li>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Active Alerts
                              </span>
                              <span className='text-sm font-medium'>
                                {activeSensor.alerts.length}
                              </span>
                            </li>
                            <li className='flex justify-between'>
                              <span className='text-sm text-gray-500'>
                                Device ID
                              </span>
                              <span className='text-sm font-medium'>
                                {activeSensor.id}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Battery and Signal History Chart */}
                  {isMounted && (
                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <h6 className='mb-3 font-medium text-gray-500'>
                        Battery & Signal Trends
                      </h6>
                      <ReactApexChart
                        options={batterySignalChartOptions}
                        series={batterySignalSeries}
                        height={250}
                        type='line'
                      />
                    </div>
                  )}
                </>
              )}

              {activeTab === 'timeline' && (
                <div className='space-y-6'>
                  {/* Connection Timeline Chart */}
                  {isMounted && (
                    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                      <div className='mb-4 flex items-center justify-between'>
                        <h6 className='font-medium text-gray-500'>
                          Connection History
                        </h6>
                        <div className='text-xs text-gray-500'>
                          Last 7 Days • Uptimes %
                        </div>
                      </div>
                      <ReactApexChart
                        options={connectionHistoryChartOptions}
                        series={connectionHistorySeries}
                        height={300}
                        type='area'
                      />
                    </div>
                  )}

                  {/* Connection Events Timeline */}
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                    <h6 className='mb-4 font-medium text-gray-500'>
                      Connection Events
                    </h6>
                    <div className='relative'>
                      {/* Timeline line */}
                      <div className='absolute left-3 top-3 h-full w-0.5 bg-gray-200 dark:bg-gray-700'></div>

                      {/* Timeline events */}
                      <div className='relative ml-8 space-y-6'>
                        {activeSensor.connectionHistory.map((event, index) => (
                          <div key={index} className='relative'>
                            {/* Timeline dot */}
                            <div
                              className={`absolute -left-8 -top-1 h-4 w-4 rounded-full ${
                                event.status === 'Connected'
                                  ? 'bg-green-500'
                                  : event.status === 'Warning'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              } border-4 border-white dark:border-gray-900`}
                            ></div>

                            {/* Timeline content */}
                            <div
                              className={`rounded-lg p-3 ${
                                event.status === 'Connected'
                                  ? 'bg-green-50 dark:bg-green-900/20'
                                  : event.status === 'Warning'
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20'
                                  : 'bg-red-50 dark:bg-red-900/20'
                              }`}
                            >
                              <p className='flex items-center text-sm font-medium'>
                                <MdTimeline className='mr-2' />
                                {event.status} - {event.date}
                              </p>
                              <p className='mt-1 text-xs text-gray-500'>
                                {event.status === 'Connected'
                                  ? 'Sensor operating normally'
                                  : event.status === 'Warning'
                                  ? 'Sensor experiencing issues'
                                  : 'Sensor disconnected from network'}
                              </p>
                              <div className='mt-2 flex justify-between text-xs'>
                                <span>Uptime: {event.uptime}%</span>
                                <span
                                  className={`font-medium ${
                                    event.uptime > 95
                                      ? 'text-green-600'
                                      : event.uptime > 80
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {event.uptime > 95
                                    ? 'Good'
                                    : event.uptime > 80
                                    ? 'Warning'
                                    : 'Critical'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alert History */}
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                    <h6 className='mb-4 font-medium text-gray-500'>
                      Recent Alerts
                    </h6>
                    {activeSensor.alerts.length > 0 ? (
                      <div className='space-y-3'>
                        {activeSensor.alerts.map((alert, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-3 ${
                              alert.type === 'Critical'
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : alert.type === 'Disconnection'
                                ? 'bg-orange-50 dark:bg-orange-900/20'
                                : 'bg-yellow-50 dark:bg-yellow-900/20'
                            }`}
                          >
                            <div className='flex justify-between'>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  alert.type === 'Critical'
                                    ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : alert.type === 'Disconnection'
                                    ? 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                    : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                              >
                                {alert.type}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {new Date(alert.date).toLocaleString()}
                              </span>
                            </div>
                            <p className='mt-2 text-sm'>{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500'>
                        No recent alerts found.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className='space-y-6'>
                  {/* Maintenance History */}
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                    <h6 className='mb-4 font-medium text-gray-500'>
                      Maintenance History
                    </h6>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                        <thead className='bg-gray-50 dark:bg-gray-800'>
                          <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                              Date
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                              Type
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                              Technician
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
                          {activeSensor.maintenanceHistory.map(
                            (record, index) => (
                              <tr
                                key={index}
                                className='hover:bg-gray-50 dark:hover:bg-gray-800'
                              >
                                <td className='px-4 py-3 text-sm'>
                                  {record.date}
                                </td>
                                <td className='px-4 py-3 text-sm'>
                                  {record.type}
                                </td>
                                <td className='px-4 py-3 text-sm'>
                                  {record.technician}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Maintenance Schedule */}
                  <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900'>
                    <h6 className='mb-4 font-medium text-gray-500'>
                      Upcoming Maintenance
                    </h6>
                    <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='font-medium'>Regular Calibration</p>
                          <p className='mt-1 text-xs text-gray-500'>
                            Scheduled for next month
                          </p>
                        </div>
                        <span className='text-sm font-medium'>2025-06-15</span>
                      </div>
                    </div>
                    <div className='mt-4 flex justify-between'>
                      <span className='text-sm text-gray-500'>
                        Next battery replacement:
                      </span>
                      <span className='text-sm font-medium'>
                        {activeSensor.batteryLevel > 70
                          ? 'Estimated 2025-08-15'
                          : activeSensor.batteryLevel > 30
                          ? 'Estimated 2025-06-10'
                          : 'Required urgently'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='flex h-[600px] flex-col items-center justify-center text-gray-500'>
              <RiSensorFill size={48} className='mb-4 opacity-50' />
              <p>Select a sensor to view detailed health information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorHealthMain;
