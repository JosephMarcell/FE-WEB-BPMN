'use client';

import { Tab } from '@headlessui/react';
import type { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import Flatpickr from 'react-flatpickr';
import {
  FaBolt,
  FaCalendarAlt,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaDownload,
  FaTachometerAlt,
  FaThermometerHalf,
  FaTint,
  FaWater,
  FaWind,
} from 'react-icons/fa';
import { MdOutlineShowChart, MdSensors } from 'react-icons/md';
import { RiSensorFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import 'react-circular-progressbar/dist/styles.css';
import 'flatpickr/dist/flatpickr.css';

import Dropdown from '@/components/dropdown';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';

import { IRootState } from '@/store';

// Tanggal data (7-17 Mei 2025)
const chartDates = [
  '2025-05-07',
  '2025-05-08',
  '2025-05-09',
  '2025-05-10',
  '2025-05-11',
  '2025-05-12',
  '2025-05-13',
  '2025-05-14',
  '2025-05-15',
  '2025-05-16',
  '2025-05-17',
];

// Helper untuk format tanggal ke label chart - FIX: ensure consistent date handling
const formatDate = (dateStr: string) => {
  // Parse with explicit UTC to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day}/${month}`; // Display as day/month
};

// Parameter Icons
const parameterIcons = [
  <FaTint size={40} key='ph' />,
  <FaWater size={40} key='do' />,
  <FaWind size={40} key='turbidity' />,
  <FaBolt size={40} key='conductivity' />,
  <FaThermometerHalf size={40} key='temperature' />,
  <FaTachometerAlt size={40} key='tds' />,
];

const parameterLabels = [
  'pH',
  'DO (mg/L)',
  'Turbidity (NTU)',
  'Conductivity (µS/cm)',
  'Temperature (°C)',
  'TDS (ppm)',
];

// Data chart per sensor
const sensors = [
  {
    id: 'sensor-001',
    name: 'Sensor 001',
    location: 'Kali Mas, Surabaya',
    status: 'Active',
    data: {
      pH: 7.2,
      DO: 6.8,
      Turbidity: 2.5,
      Conductivity: 350,
      Temperature: 27.5,
      TDS: 500,
    },
    chart: {
      pH: [7.1, 7.2, 7.3, 7.2, 7.1, 7.0, 7.2, 7.1, 7.2, 7.3, 7.2],
      DO: [6.7, 6.8, 6.9, 6.8, 6.7, 6.6, 6.8, 6.7, 6.8, 6.9, 6.8],
      Turbidity: [2.0, 2.1, 2.2, 2.1, 2.0, 2.1, 2.1, 2.0, 2.1, 2.2, 2.1],
      Conductivity: [340, 350, 355, 360, 350, 345, 350, 355, 350, 355, 350],
      Temperature: [
        27, 27.2, 27.5, 27.3, 27.1, 27.0, 27.2, 27.1, 27.2, 27.3, 27.2,
      ],
      TDS: [480, 500, 510, 505, 495, 490, 500, 495, 500, 510, 500],
    },
  },
  {
    id: 'sensor-002',
    name: 'Sensor 002',
    location: 'Rungkut, Surabaya',
    status: 'Warning',
    data: {
      pH: 7.5,
      DO: 6.2,
      Turbidity: 3.0,
      Conductivity: 400,
      Temperature: 28.1,
      TDS: 600,
    },
    chart: {
      pH: [7.4, 7.5, 7.6, 7.5, 7.4, 7.3, 7.5, 7.4, 7.5, 7.6, 7.5],
      DO: [6.1, 6.2, 6.3, 6.2, 6.1, 6.0, 6.2, 6.1, 6.2, 6.3, 6.2],
      Turbidity: [2.8, 3.0, 3.1, 3.0, 2.9, 2.8, 3.0, 2.9, 3.0, 3.1, 3.0],
      Conductivity: [390, 400, 410, 405, 395, 390, 400, 395, 400, 410, 400],
      Temperature: [
        28, 28.1, 28.3, 28.2, 28.0, 27.9, 28.1, 28.0, 28.1, 28.2, 28.1,
      ],
      TDS: [590, 600, 610, 605, 595, 590, 600, 595, 600, 610, 600],
    },
  },
  {
    id: 'sensor-003',
    name: 'Sensor 003',
    location: 'Kenjeran, Surabaya',
    status: 'Offline',
    data: {
      pH: 6.9,
      DO: 7.0,
      Turbidity: 1.8,
      Conductivity: 320,
      Temperature: 26.7,
      TDS: 450,
    },
    chart: {
      pH: [6.8, 6.9, 7.0, 6.9, 6.8, 6.7, 6.9, 6.8, 6.9, 7.0, 6.9],
      DO: [6.9, 7.0, 7.1, 7.0, 6.9, 6.8, 7.0, 6.9, 7.0, 7.1, 7.0],
      Turbidity: [1.7, 1.8, 1.9, 1.8, 1.7, 1.6, 1.8, 1.7, 1.8, 1.9, 1.8],
      Conductivity: [315, 320, 325, 320, 315, 310, 320, 315, 320, 325, 320],
      Temperature: [
        26.5, 26.7, 26.9, 26.7, 26.5, 26.4, 26.7, 26.5, 26.7, 26.9, 26.7,
      ],
      TDS: [440, 450, 460, 450, 440, 435, 450, 440, 450, 460, 450],
    },
  },
];

// Default start and end dates
const defaultEnd = '2025-05-17';
const defaultStart = '2025-05-11';

const SensorReadingMain = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [isMounted, setIsMounted] = useState(false);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [viewMode, setViewMode] = useState<'real-time' | 'historical'>(
    'real-time',
  );
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(defaultStart),
    new Date(defaultEnd),
  ]);
  const [activeParameter, setActiveParameter] = useState('pH');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper: average calculation
  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

  // Filter sensors based on selection
  const filteredSensors =
    selectedSensor === 'all'
      ? sensors
      : sensors.filter(s => s.id === selectedSensor);

  // Get display data for filtered sensors
  const displayData =
    filteredSensors.length === 1
      ? filteredSensors[0].data
      : {
          pH: avg(filteredSensors.map(s => s.data.pH)),
          DO: avg(filteredSensors.map(s => s.data.DO)),
          Turbidity: avg(filteredSensors.map(s => s.data.Turbidity)),
          Conductivity: avg(filteredSensors.map(s => s.data.Conductivity)),
          Temperature: avg(filteredSensors.map(s => s.data.Temperature)),
          TDS: avg(filteredSensors.map(s => s.data.TDS)),
        };

  // Helper filter chart data by date range
  const getFilteredChart = (chart: (typeof sensors)[0]['chart']) => {
    // Find indexes with better error handling
    const startIdx = chartDates.findIndex(d => d === startDate);
    const endIdx = chartDates.findIndex(d => d === endDate);

    console.log('Selected date range:', startDate, 'to', endDate);
    console.log('Found indexes:', startIdx, 'to', endIdx);

    // Validate indexes
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      console.warn('Invalid date range selected:', startDate, 'to', endDate);
      return {
        pH: [],
        DO: [],
        Turbidity: [],
        Conductivity: [],
        Temperature: [],
        TDS: [],
        categories: [],
      };
    }

    // Create filtered data
    return {
      pH: chart.pH.slice(startIdx, endIdx + 1),
      DO: chart.DO.slice(startIdx, endIdx + 1),
      Turbidity: chart.Turbidity.slice(startIdx, endIdx + 1),
      Conductivity: chart.Conductivity.slice(startIdx, endIdx + 1),
      Temperature: chart.Temperature.slice(startIdx, endIdx + 1),
      TDS: chart.TDS.slice(startIdx, endIdx + 1),
      categories: chartDates.slice(startIdx, endIdx + 1).map(formatDate),
    };
  };

  // Chart for all sensors (average)
  const allChart = (() => {
    const startIdx = chartDates.findIndex(d => d === startDate);
    const endIdx = chartDates.findIndex(d => d === endDate);
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      return {
        pH: [],
        DO: [],
        Turbidity: [],
        Conductivity: [],
        Temperature: [],
        TDS: [],
        categories: [],
      };
    }
    return {
      pH: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) => avg(sensors.map(s => s.chart.pH[startIdx + i]))),
      DO: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) => avg(sensors.map(s => s.chart.DO[startIdx + i]))),
      Turbidity: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) => avg(sensors.map(s => s.chart.Turbidity[startIdx + i]))),
      Conductivity: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) =>
          avg(sensors.map(s => s.chart.Conductivity[startIdx + i])),
        ),
      Temperature: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) =>
          avg(sensors.map(s => s.chart.Temperature[startIdx + i])),
        ),
      TDS: chartDates
        .slice(startIdx, endIdx + 1)
        .map((_, i) => avg(sensors.map(s => s.chart.TDS[startIdx + i]))),
      categories: chartDates.slice(startIdx, endIdx + 1).map(formatDate),
    };
  })();

  // Chart to display based on selection
  const displayChart =
    filteredSensors.length === 1
      ? getFilteredChart(filteredSensors[0].chart)
      : allChart;

  // Single parameter chart series
  const singleParameterChart = {
    series: [
      {
        name: activeParameter,
        data: displayChart[
          activeParameter as keyof typeof displayChart
        ] as number[],
      },
    ],
    options: {
      chart: {
        type: chartType,
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
      },
      stroke: {
        curve: 'smooth',
        width: chartType === 'bar' ? 0 : 2,
      },
      xaxis: {
        categories: displayChart.categories,
        title: { text: 'Date' },
      },
      yaxis: {
        title: { text: activeParameter },
        labels: {
          formatter: (val: number) => val.toFixed(2),
        },
      },
      colors: [
        '#00ab55',
        '#1e90ff',
        '#ff9800',
        '#e91e63',
        '#43a047',
        '#9c27b0',
      ],
      tooltip: {
        y: {
          formatter: (val: number) => val.toFixed(2),
        },
      },
      fill: {
        type: chartType === 'area' ? 'gradient' : 'solid',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: ``,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
        strokeDashArray: 5,
      },
      markers: {
        size: 4,
        colors: ['#00ab55'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
    } as ApexOptions,
  };

  // Multi parameter chart for comparison
  const multiParameterChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: displayChart.categories,
      title: { text: 'Date' },
    },
    yaxis: {
      title: { text: 'Value' },
      labels: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    legend: { position: 'top' },
    colors: ['#00ab55', '#1e90ff', '#ff9800', '#e91e63', '#43a047', '#9c27b0'],
    tooltip: {
      y: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    title: {
      text: 'Parameter Comparison',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  };

  const multiParameterChartSeries = [
    { name: 'pH', data: displayChart.pH },
    { name: 'DO', data: displayChart.DO },
    { name: 'Turbidity', data: displayChart.Turbidity },
    { name: 'Conductivity', data: displayChart.Conductivity },
    { name: 'Temperature', data: displayChart.Temperature },
    { name: 'TDS', data: displayChart.TDS },
  ];

  // Handle export option
  const handleExport = (type: 'csv' | 'pdf') => {
    // In real implementation, this would call an API or process data for export
    alert(`Exporting data as ${type.toUpperCase()} format...`);
  };

  // Handle date range change - FIX: correct date handling
  const handleDateRangeChange = (selectedDates: Date[]) => {
    setDateRange(selectedDates);
    if (selectedDates.length === 2) {
      // Format dates with proper padding for consistency
      const formatDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const newStartDate = formatDateString(selectedDates[0]);
      const newEndDate = formatDateString(selectedDates[1]);

      // Check if dates are in the available range
      if (!chartDates.includes(newStartDate)) {
        console.warn('Start date not in available range:', newStartDate);
        // Find closest available date
        const availableDates = chartDates.filter(d => d >= newStartDate);
        if (availableDates.length > 0) {
          setStartDate(availableDates[0]);
        } else {
          setStartDate(chartDates[0]);
        }
      } else {
        setStartDate(newStartDate);
      }

      if (!chartDates.includes(newEndDate)) {
        console.warn('End date not in available range:', newEndDate);
        // Find closest available date
        const availableDates = chartDates.filter(d => d <= newEndDate);
        if (availableDates.length > 0) {
          setEndDate(availableDates[availableDates.length - 1]);
        } else {
          setEndDate(chartDates[chartDates.length - 1]);
        }
      } else {
        setEndDate(newEndDate);
      }
    }
  };

  // Add this section in the SensorReadingMain component, just before the return statement
  // This calculates which tab should be selected based on activeParameter
  const getActiveTabIndex = () => {
    const parametersList = Object.keys(displayData);
    const index = parametersList.findIndex(param => param === activeParameter);
    return index >= 0 ? index : 0;
  };

  return (
    <div className='mt-6'>
      {/* Page Header */}
      <div className='mb-6'>
        <div className='flex flex-wrap items-center justify-between'>
          <h2 className='dark:text-white-light flex items-center text-2xl font-bold'>
            <RiSensorFill className='text-primary mr-2' size={28} />
            Sensor Reading & Data Visualization
          </h2>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setViewMode('real-time')}
              className={`btn ${
                viewMode === 'real-time' ? 'btn-primary' : 'btn-outline-primary'
              } btn-sm`}
            >
              <MdSensors className='mr-2' /> Real-time View
            </button>
            <button
              onClick={() => setViewMode('historical')}
              className={`btn ${
                viewMode === 'historical'
                  ? 'btn-primary'
                  : 'btn-outline-primary'
              } btn-sm`}
            >
              <MdOutlineShowChart className='mr-2' /> Historical Data
            </button>
          </div>
        </div>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Monitor sensor readings in real-time and visualize historical data
          trends
        </p>
      </div>

      {/* Filter Section */}
      <div className='mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900'>
        <div className='flex items-center gap-2'>
          {/* Sensor Selection */}
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
            {sensors.map(sensor => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name} ({sensor.location})
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div className='flex items-center gap-2'>
          <label className='flex items-center whitespace-nowrap text-sm font-medium'>
            <FaCalendarAlt className='mr-1' /> Date Range:
          </label>
          <div className='relative'>
            <Flatpickr
              options={{
                mode: 'range',
                dateFormat: 'Y-m-d',
                minDate: '2025-05-07',
                maxDate: '2025-05-17',
                defaultDate: dateRange,
                // Add these options:
                enableTime: false,
                time_24hr: true,
                locale: {
                  firstDayOfWeek: 1, // Start week on Monday
                },
              }}
              value={dateRange}
              onChange={dates => handleDateRangeChange(dates as Date[])}
              className='form-input py-2 pl-8 pr-4'
              placeholder='Select date range'
            />
            <FaCalendarAlt className='absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400' />
          </div>
        </div>

        {/* Chart Type Selection */}
        {viewMode === 'historical' && (
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap text-sm font-medium'>
              Chart Type:
            </label>
            <div className='flex rounded-md border border-gray-300 dark:border-gray-700'>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 ${
                  chartType === 'line'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title='Line Chart'
              >
                <FaChartLine />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`p-2 ${
                  chartType === 'area'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title='Area Chart'
              >
                <FaChartArea />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 ${
                  chartType === 'bar'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title='Bar Chart'
              >
                <FaChartBar />
              </button>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className='ml-auto flex gap-2'>
          <button
            onClick={() => handleExport('csv')}
            className='btn btn-outline-info btn-sm flex items-center'
            title='Export as CSV'
          >
            <FaDownload className='mr-1' /> CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className='btn btn-outline-danger btn-sm flex items-center'
            title='Export as PDF'
          >
            <FaDownload className='mr-1' /> PDF
          </button>
        </div>
      </div>

      {/* Real-time Sensor Data View */}
      {viewMode === 'real-time' && (
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* Sensor Data Cards */}
          <div className='panel md:col-span-2'>
            <div className='mb-5'>
              <h5 className='text-lg font-semibold'>Sensor Readings</h5>
              <p className='text-xs text-gray-500'>
                Current readings from{' '}
                {selectedSensor === 'all'
                  ? 'all sensors'
                  : filteredSensors[0]?.name}
              </p>
            </div>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
              {Object.entries(displayData).map(([key, value], idx) => {
                const label = parameterLabels[idx];
                // Calculate percentage for gauge visualization
                let percentage = 0;
                if (key === 'pH') {
                  percentage = (Number(value) / 14) * 100;
                } else if (key === 'Temperature') {
                  percentage = (Number(value) / 50) * 100;
                } else {
                  percentage = (Number(value) / 1000) * 100;
                }

                // Colors based on parameter ranges
                let color = '#00ab55'; // Default green
                if (key === 'pH') {
                  if (value < 6.5 || value > 8.5) color = '#f59e0b'; // Warning
                  if (value < 6.0 || value > 9.0) color = '#dc2626'; // Critical
                }

                return (
                  <div
                    key={key}
                    className='relative flex cursor-pointer flex-col items-center rounded-md bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-gray-800'
                    onClick={() => {
                      setActiveParameter(key);
                      if (viewMode === 'real-time') setViewMode('historical');
                    }}
                  >
                    {/* Icon positioned above the gauge */}
                    <div className='absolute left-2 top-2 text-gray-500 dark:text-gray-400'>
                      {parameterIcons[idx]}
                    </div>

                    {/* Gauge with value */}
                    <div className='mx-auto mb-2 mt-8 h-32 w-32'>
                      <CircularProgressbar
                        value={Math.min(percentage, 100)}
                        text={String(Number(value).toFixed(2))}
                        styles={buildStyles({
                          pathColor: color,
                          textColor: isDark ? '#fff' : '#000',
                          trailColor: isDark ? '#3f3f46' : '#f3f4f6',
                          textSize: '20px',
                          pathTransitionDuration: 0.5,
                        })}
                      />
                    </div>

                    {/* Labels below gauge */}
                    <div className='mt-4 text-center'>
                      <p className='text-lg font-semibold'>{key}</p>
                      <p className='text-xs text-gray-500'>{label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sensor Status Info Panel */}
          <div className='panel'>
            <div className='mb-5 flex justify-between'>
              <h5 className='text-lg font-semibold'>Sensor Status</h5>
              <button className='text-primary text-sm hover:underline'>
                Refresh
              </button>
            </div>

            {selectedSensor === 'all' ? (
              <div className='space-y-4'>
                {sensors.map(sensor => (
                  <div
                    key={sensor.id}
                    className={`rounded-lg border p-4 ${
                      sensor.status === 'Active'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : sensor.status === 'Warning'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
                    }`}
                  >
                    <div className='flex justify-between'>
                      <div>
                        <h6 className='font-semibold'>{sensor.name}</h6>
                        <p className='text-xs text-gray-500'>
                          {sensor.location}
                        </p>
                      </div>
                      <span
                        className={`badge ${
                          sensor.status === 'Active'
                            ? 'bg-success'
                            : sensor.status === 'Warning'
                            ? 'bg-warning'
                            : 'bg-gray-500'
                        }`}
                      >
                        {sensor.status}
                      </span>
                    </div>
                    <div className='mt-3 grid grid-cols-2 gap-2'>
                      <div className='text-xs'>
                        <span className='text-gray-500'>Last Reading:</span>
                        <p className='font-medium'>2025-05-17 14:30</p>
                      </div>
                      <div className='text-xs'>
                        <span className='text-gray-500'>Signal Strength:</span>
                        <p className='font-medium'>
                          {sensor.status === 'Active'
                            ? 'Excellent'
                            : sensor.status === 'Warning'
                            ? 'Good'
                            : 'Poor'}
                        </p>
                      </div>
                      <div className='text-xs'>
                        <span className='text-gray-500'>Battery:</span>
                        <p className='font-medium'>
                          {sensor.status === 'Active'
                            ? '85%'
                            : sensor.status === 'Warning'
                            ? '62%'
                            : '23%'}
                        </p>
                      </div>
                      <div className='text-xs'>
                        <span className='text-gray-500'>Last Calibration:</span>
                        <p className='font-medium'>2025-04-15</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='rounded-lg border p-4'>
                <div className='flex justify-between'>
                  <div>
                    <h6 className='font-semibold'>
                      {filteredSensors[0]?.name}
                    </h6>
                    <p className='text-xs text-gray-500'>
                      {filteredSensors[0]?.location}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      filteredSensors[0]?.status === 'Active'
                        ? 'bg-success'
                        : filteredSensors[0]?.status === 'Warning'
                        ? 'bg-warning'
                        : 'bg-gray-500'
                    }`}
                  >
                    {filteredSensors[0]?.status}
                  </span>
                </div>

                <div className='mt-4'>
                  <h6 className='mb-2 font-semibold'>Detailed Information</h6>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='text-sm'>
                      <span className='text-gray-500'>Device ID:</span>
                      <p className='font-medium'>{filteredSensors[0]?.id}</p>
                    </div>
                    <div className='text-sm'>
                      <span className='text-gray-500'>Type:</span>
                      <p className='font-medium'>Water Quality</p>
                    </div>
                    <div className='text-sm'>
                      <span className='text-gray-500'>Signal:</span>
                      <div className='mt-1 flex'>
                        <div className='mr-1 h-2 w-2 rounded-full bg-green-500'></div>
                        <div className='mr-1 h-2 w-2 rounded-full bg-green-500'></div>
                        <div className='mr-1 h-2 w-2 rounded-full bg-green-500'></div>
                        <div className='h-2 w-2 rounded-full bg-gray-300'></div>
                      </div>
                    </div>
                    <div className='text-sm'>
                      <span className='text-gray-500'>Battery:</span>
                      <div className='mt-1 h-2.5 w-full rounded-full bg-gray-200'>
                        <div
                          className='h-2.5 rounded-full bg-green-500'
                          style={{ width: '70%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <h6 className='mb-2 font-semibold'>Maintenance</h6>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='text-sm'>
                        <span className='text-gray-500'>Last Calibration:</span>
                        <p className='font-medium'>2025-04-15</p>
                      </div>
                      <div className='text-sm'>
                        <span className='text-gray-500'>Next Maintenance:</span>
                        <p className='font-medium'>2025-07-15</p>
                      </div>
                      <div className='text-sm'>
                        <span className='text-gray-500'>Firmware:</span>
                        <p className='font-medium'>v2.3.4</p>
                      </div>
                      <div className='text-sm'>
                        <span className='text-gray-500'>
                          Reporting Interval:
                        </span>
                        <p className='font-medium'>15 min</p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 flex justify-end'>
                    <button className='btn btn-primary btn-sm'>
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Data View */}
      {viewMode === 'historical' && (
        <div className='mb-6'>
          <Tab.Group
            defaultIndex={getActiveTabIndex()}
            selectedIndex={getActiveTabIndex()}
          >
            <Tab.List className='mb-5 flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'>
              {Object.keys(displayData).map(param => (
                <Tab
                  key={param}
                  className={({ selected }) => `
                    flex-1 px-4 py-2 text-center text-sm font-medium focus:outline-none
                    ${
                      selected
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                  onClick={() => setActiveParameter(param)}
                >
                  {param}
                </Tab>
              ))}
              <Tab
                className={({ selected }) => `
                  flex-1 px-4 py-2 text-center text-sm font-medium focus:outline-none
                  ${
                    selected
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
              >
                All Parameters
              </Tab>
            </Tab.List>
            <Tab.Panels className='rounded-lg'>
              {/* Individual parameter tabs */}
              {Object.keys(displayData).map(param => (
                <Tab.Panel key={param} className='panel'>
                  <div className='mb-5 flex items-center justify-between'>
                    <div>
                      <h5 className='text-lg font-semibold'>
                        {param} Historical Data
                      </h5>
                      <p className='text-xs text-gray-500'>
                        {startDate} to {endDate} ·{' '}
                        {selectedSensor === 'all'
                          ? 'All Sensors'
                          : filteredSensors[0]?.name}
                      </p>
                    </div>
                    <Dropdown
                      offset={[0, 1]}
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

                  {isMounted ? (
                    <div className='mb-5'>
                      <ReactApexChart
                        options={singleParameterChart.options}
                        series={singleParameterChart.series}
                        type={chartType}
                        height={400}
                      />
                    </div>
                  ) : (
                    <div className='bg-white-light/30 dark:bg-dark grid min-h-[400px] place-content-center dark:bg-opacity-[0.08]'>
                      <span className='inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white'></span>
                    </div>
                  )}

                  {/* Statistical Summary */}
                  <div className='mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                    <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                      <h6 className='text-xs text-gray-500'>Min</h6>
                      <p className='text-lg font-bold'>
                        {Math.min(
                          ...(displayChart[
                            param as keyof typeof displayChart
                          ] as number[]),
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                      <h6 className='text-xs text-gray-500'>Max</h6>
                      <p className='text-lg font-bold'>
                        {Math.max(
                          ...(displayChart[
                            param as keyof typeof displayChart
                          ] as number[]),
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                      <h6 className='text-xs text-gray-500'>Average</h6>
                      <p className='text-lg font-bold'>
                        {avg(
                          displayChart[
                            param as keyof typeof displayChart
                          ] as number[],
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                      <h6 className='text-xs text-gray-500'>Variance</h6>
                      <p className='text-lg font-bold'>
                        {(
                          Math.max(
                            ...(displayChart[
                              param as keyof typeof displayChart
                            ] as number[]),
                          ) -
                          Math.min(
                            ...(displayChart[
                              param as keyof typeof displayChart
                            ] as number[]),
                          )
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Tab.Panel>
              ))}

              {/* All parameters tab */}
              <Tab.Panel className='panel'>
                <div className='mb-5 flex items-center justify-between'>
                  <div>
                    <h5 className='text-lg font-semibold'>
                      All Parameters Comparison
                    </h5>
                    <p className='text-xs text-gray-500'>
                      {startDate} to {endDate} ·{' '}
                      {selectedSensor === 'all'
                        ? 'All Sensors'
                        : filteredSensors[0]?.name}
                    </p>
                  </div>
                  <Dropdown
                    offset={[0, 1]}
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

                {isMounted ? (
                  <div className='mb-5'>
                    <ReactApexChart
                      options={multiParameterChartOptions}
                      series={multiParameterChartSeries}
                      type='line'
                      height={400}
                    />
                  </div>
                ) : (
                  <div className='bg-white-light/30 dark:bg-dark grid min-h-[400px] place-content-center dark:bg-opacity-[0.08]'>
                    <span className='inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white'></span>
                  </div>
                )}

                {/* Data Table */}
                <div className='mt-8'>
                  <h5 className='mb-4 text-lg font-semibold'>
                    Data Table View
                  </h5>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full table-auto'>
                      <thead>
                        <tr className='bg-gray-100 dark:bg-gray-800'>
                          <th className='px-4 py-2 text-left'>Date</th>
                          {Object.keys(displayData).map(param => (
                            <th key={param} className='px-4 py-2 text-left'>
                              {param}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayChart.categories.map((date, idx) => (
                          <tr
                            key={idx}
                            className='border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                          >
                            <td className='px-4 py-2'>{date}</td>
                            {Object.keys(displayData).map(param => (
                              <td key={param} className='px-4 py-2'>
                                {(
                                  displayChart[
                                    param as keyof typeof displayChart
                                  ] as number[]
                                )[idx].toFixed(2)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  );
};

export default SensorReadingMain;
