'use client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { CircularProgressbar } from 'react-circular-progressbar';
import Flatpickr from 'react-flatpickr';
import { BsFilter } from 'react-icons/bs';
import {
  FaBolt,
  FaCalendarAlt,
  FaTachometerAlt,
  FaThermometerHalf,
  FaTint,
  FaWater,
  FaWind,
} from 'react-icons/fa';
import { FaBell } from 'react-icons/fa'; // Untuk notifikasi
import { IoClose } from 'react-icons/io5'; // Untuk tombol close modal
import { MdSensors } from 'react-icons/md';
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

// Helper untuk format tanggal ke label chart
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

// Data chart per sensor, per tanggal
const sensors = [
  {
    id: 'sensor-001',
    name: 'Sensor 001',
    lokasi: 'Kali Mas, Surabaya',
    alamat: 'Jl. Pemuda No.1, Surabaya',
    position: { lat: -7.265757, lng: 112.745083 },
    data: {
      pH: 7.2,
      DO: 6.8,
      Turbidity: 2.1,
      Conductivity: 350,
      Temperature: 27.5,
      TDS: 500,
      status: 'Active',
    },
    chart: {
      pH: [7.1, 7.2, 7.3, 7.2, 7.1, 7.0, 7.2, 7.1, 7.2, 7.3, 7.2],
      DO: [6.5, 6.7, 6.8, 6.9, 6.8, 6.7, 6.8, 6.7, 6.8, 6.9, 6.8],
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
    lokasi: 'Rungkut, Surabaya',
    alamat: 'Jl. Rungkut No.2, Surabaya',
    position: { lat: -7.302222, lng: 112.734444 },
    data: {
      pH: 7.5,
      DO: 6.2,
      Turbidity: 3.0,
      Conductivity: 400,
      Temperature: 28.1,
      TDS: 600,
      status: 'Warning',
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
    lokasi: 'Kenjeran, Surabaya',
    alamat: 'Jl. Kenjeran No.3, Surabaya',
    position: { lat: -7.236111, lng: 112.773056 },
    data: {
      pH: 6.9,
      DO: 7.0,
      Turbidity: 1.8,
      Conductivity: 320,
      Temperature: 26.7,
      TDS: 450,
      status: 'Offline',
    },
    chart: {
      pH: [6.8, 6.9, 7.0, 6.9, 6.8, 6.7, 6.9, 6.8, 6.9, 7.0, 6.9],
      DO: [6.9, 7.0, 7.1, 7.0, 6.9, 6.8, 7.0, 6.9, 7.0, 7.1, 7.0],
      Turbidity: [1.7, 1.8, 1.9, 1.8, 1.7, 1.6, 1.8, 1.7, 1.8, 1.9, 1.8],
      Conductivity: [310, 320, 325, 330, 320, 315, 320, 325, 320, 325, 320],
      Temperature: [
        26.5, 26.7, 26.9, 26.8, 26.6, 26.5, 26.7, 26.6, 26.7, 26.8, 26.7,
      ],
      TDS: [440, 450, 460, 455, 445, 440, 450, 445, 450, 460, 450],
    },
  },
];

const parameterIcons = [
  <FaTint size={40} />,
  <FaWater size={40} />,
  <FaWind size={40} />,
  <FaBolt size={40} />,
  <FaThermometerHalf size={40} />,
  <FaTachometerAlt size={40} />,
];

const parameterLabels = [
  'pH',
  'DO (mg/L)',
  'Turbidity (NTU)',
  'Conductivity (µS/cm)',
  'Temperature (°C)',
  'TDS (ppm)',
];

const allOption = { id: 'all', name: 'All Assets', lokasi: 'All Location' };

const ComponentsDashboardGeneral = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
  const [isMounted, setIsMounted] = useState(false);

  // Date range state - sama seperti sensor health
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date('2025-05-11'),
    new Date('2025-05-17'),
  ]);

  // Helper: dapatkan semua lokasi unik
  const allLocations = Array.from(new Set(sensors.map(s => s.lokasi)));
  // Helper: dapatkan semua asset unik
  const allAssets = sensors.map(s => s.id);

  // Helper: mapping lokasi ke asset
  const locationToAssets: Record<string, string[]> = {};
  sensors.forEach(s => {
    if (!locationToAssets[s.lokasi]) locationToAssets[s.lokasi] = [];
    locationToAssets[s.lokasi].push(s.id);
  });
  // Helper: mapping asset ke lokasi
  const assetToLocation: Record<string, string> = {};
  sensors.forEach(s => {
    assetToLocation[s.id] = s.lokasi;
  });

  // Multi-select state
  const [selectedLocations, setSelectedLocations] =
    useState<string[]>(allLocations);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(allAssets);

  // State untuk modal notifikasi
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper untuk multi-select
  const toggleSelect = (arr: string[], value: string, allValues: string[]) => {
    if (arr.includes(value)) {
      // Uncheck
      const filtered = arr.filter(v => v !== value);
      return filtered.length === 0 ? allValues : filtered; // minimal 1 harus terpilih
    } else {
      // Check
      const added = [...arr, value];
      return added.length === allValues.length ? allValues : added;
    }
  };

  // Toggle lokasi: jika uncheck, semua asset di lokasi itu juga uncheck. Jika check, semua asset di lokasi itu ikut checked.
  const toggleLocation = (lokasi: string) => {
    let newLocations: string[];
    let newAssets: string[];
    if (selectedLocations.includes(lokasi)) {
      // Uncheck lokasi
      newLocations = selectedLocations.filter(l => l !== lokasi);
      newAssets = selectedAssets.filter(a => assetToLocation[a] !== lokasi);
    } else {
      // Check lokasi
      newLocations = [...selectedLocations, lokasi];
      // Tambahkan semua asset di lokasi tsb
      const assetsOfLoc = locationToAssets[lokasi];
      newAssets = Array.from(new Set([...selectedAssets, ...assetsOfLoc]));
    }
    // Minimal 1 lokasi dan 1 asset harus terpilih
    if (newLocations.length === 0) return;
    if (newAssets.length === 0) return;
    setSelectedLocations(newLocations);
    setSelectedAssets(newAssets);
  };

  // Toggle asset: jika uncheck, cek apakah semua asset di lokasi tsb jadi tidak ada yang terpilih, maka lokasi tsb juga uncheck.
  // Jika check asset, lokasi terkait otomatis checked.
  const toggleAsset = (assetId: string) => {
    let newAssets: string[];
    let newLocations: string[] = selectedLocations;
    if (selectedAssets.includes(assetId)) {
      // Uncheck asset
      newAssets = selectedAssets.filter(a => a !== assetId);
      const lokasi = assetToLocation[assetId];
      const assetsOfLoc = locationToAssets[lokasi];
      const stillChecked = assetsOfLoc.some(
        a => a !== assetId && newAssets.includes(a),
      );
      if (!stillChecked) {
        // Tidak ada asset di lokasi tsb yang terpilih, uncheck lokasi
        newLocations = selectedLocations.filter(l => l !== lokasi);
      }
    } else {
      // Check asset
      newAssets = [...selectedAssets, assetId];
      const lokasi = assetToLocation[assetId];
      if (!selectedLocations.includes(lokasi)) {
        newLocations = [...selectedLocations, lokasi];
      }
    }
    // Minimal 1 lokasi dan 1 asset harus terpilih
    if (newLocations.length === 0) return;
    if (newAssets.length === 0) return;
    setSelectedAssets(newAssets);
    setSelectedLocations(newLocations);
  };

  // Filter sensors
  const filteredSensors = sensors.filter(
    s => selectedLocations.includes(s.lokasi) && selectedAssets.includes(s.id),
  );

  // Helper rata-rata
  const avg = (arr: number[]) =>
    arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

  // Helper filter chart sesuai tanggal
  const getFilteredChart = (chart: (typeof sensors)[0]['chart']) => {
    if (dateRange.length !== 2) {
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

    const startDate = dateRange[0].toISOString().split('T')[0];
    const endDate = dateRange[1].toISOString().split('T')[0];

    const startIdx = chartDates.findIndex(d => d === startDate);
    const endIdx = chartDates.findIndex(d => d === endDate);

    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
      // Jika tanggal tidak valid, kosongkan chart
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
      pH: chart.pH.slice(startIdx, endIdx + 1),
      DO: chart.DO.slice(startIdx, endIdx + 1),
      Turbidity: chart.Turbidity.slice(startIdx, endIdx + 1),
      Conductivity: chart.Conductivity.slice(startIdx, endIdx + 1),
      Temperature: chart.Temperature.slice(startIdx, endIdx + 1),
      TDS: chart.TDS.slice(startIdx, endIdx + 1),
      categories: chartDates.slice(startIdx, endIdx + 1).map(formatDate),
    };
  };

  // Chart rata-rata semua sensor (default)
  const allChart = (() => {
    if (dateRange.length !== 2) {
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

    const startDate = dateRange[0].toISOString().split('T')[0];
    const endDate = dateRange[1].toISOString().split('T')[0];

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

  // Data yang akan ditampilkan (jika multi, rata-rata)
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
          status: '-',
        };
  const displayChart = (() => {
    if (filteredSensors.length === 1)
      return getFilteredChart(filteredSensors[0].chart);
    if (filteredSensors.length > 1) {
      // Rata-rata chart
      if (dateRange.length !== 2) {
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

      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];

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
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.pH[startIdx + i])),
          ),
        DO: chartDates
          .slice(startIdx, endIdx + 1)
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.DO[startIdx + i])),
          ),
        Turbidity: chartDates
          .slice(startIdx, endIdx + 1)
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.Turbidity[startIdx + i])),
          ),
        Conductivity: chartDates
          .slice(startIdx, endIdx + 1)
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.Conductivity[startIdx + i])),
          ),
        Temperature: chartDates
          .slice(startIdx, endIdx + 1)
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.Temperature[startIdx + i])),
          ),
        TDS: chartDates
          .slice(startIdx, endIdx + 1)
          .map((_, i) =>
            avg(filteredSensors.map(s => s.chart.TDS[startIdx + i])),
          ),
        categories: chartDates.slice(startIdx, endIdx + 1).map(formatDate),
      };
    }
    return allChart;
  })();

  const displayAlamat =
    filteredSensors.length === 1 ? filteredSensors[0].alamat : '-';
  const displaySensorName =
    filteredSensors.length === 1
      ? filteredSensors[0].name
      : filteredSensors.length === sensors.length
      ? 'All Assets'
      : 'Multiple Assets';
  const displayLokasi =
    filteredSensors.length === 1
      ? filteredSensors[0].lokasi
      : filteredSensors.length === sensors.length
      ? 'All Location'
      : 'Multiple Location';
  const displayPosition =
    filteredSensors.length === 1
      ? filteredSensors[0].position
      : { lat: -7.265757, lng: 112.745083 };

  // Chart
  const chartSeries = [
    { name: 'pH', data: displayChart.pH },
    { name: 'DO', data: displayChart.DO },
    { name: 'Turbidity', data: displayChart.Turbidity },
    { name: 'Conductivity', data: displayChart.Conductivity },
    { name: 'Temperature', data: displayChart.Temperature },
    { name: 'TDS', data: displayChart.TDS },
  ];

  const chartOptions: ApexOptions = {
    chart: { type: 'line', height: 300, toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: displayChart.categories,
      title: { text: 'Tanggal' },
    },
    yaxis: {
      title: { text: 'Nilai' },
      labels: {
        formatter: (val: number) => val?.toFixed(2),
      },
    },
    legend: { position: 'top' },
    colors: ['#00ab55', '#1e90ff', '#ff9800', '#e91e63', '#43a047', '#9c27b0'],
    tooltip: {
      y: {
        formatter: (val: number) => val?.toFixed(2),
      },
    },
  };

  // Map style & center
  const mapContainerStyle = { width: '100%', height: '400px' };
  // Ganti mapCenter agar default ke rata-rata lokasi jika multi, atau ke satu sensor jika satu
  const mapCenter =
    filteredSensors.length === 1
      ? filteredSensors[0].position
      : {
          lat: avg(filteredSensors.map(s => s.position.lat)),
          lng: avg(filteredSensors.map(s => s.position.lng)),
        };

  // Summary statistics
  const totalSensor = sensors.length;
  const totalActive = sensors.filter(s => s.data.status === 'Active').length;
  const totalWarning = sensors.filter(s => s.data.status === 'Warning').length;
  const totalOffline = sensors.filter(s => s.data.status === 'Offline').length;
  const avgParam = (param: keyof (typeof sensors)[0]['data']) =>
    (
      sensors.reduce((sum, s) => sum + Number(s.data[param]), 0) /
      sensors.length
    ).toFixed(2);

  // Notifikasi/History dummy (bisa diganti dengan data asli)
  const notifications = [
    {
      time: '17/05/2025 14:23',
      type: 'warning',
      msg: 'Sensor 002: pH di luar batas normal!',
    },
    {
      time: '17/05/2025 13:50',
      type: 'offline',
      msg: 'Sensor 003: Status Offline.',
    },
    {
      time: '17/05/2025 13:10',
      type: 'active',
      msg: 'Sensor 001: Kembali aktif.',
    },
    {
      time: '17/05/2025 12:40',
      type: 'warning',
      msg: 'Sensor 001: DO menurun drastis.',
    },
    {
      time: '17/05/2025 12:10',
      type: 'active',
      msg: 'Sensor 002: Kembali aktif.',
    },
    {
      time: '17/05/2025 11:50',
      type: 'offline',
      msg: 'Sensor 001: Status Offline.',
    },
    // ...bisa tambah dummy lain...
  ];

  // Export handler (dummy, implementasi export sesuaikan kebutuhan)
  const handleExport = (type: string) => {
    // Implementasi export data ke CSV/Excel/PDF
    alert(`Export ${type} untuk seluruh data (dummy)`);
  };

  return (
    <div>
      <ul className='flex space-x-2 rtl:space-x-reverse'>
        <li>
          <span className='text-primary font-bold'>Dashboard</span>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"></li>
        <li>
          <span className='font-semibold text-blue-700'>
            Water Quality Monitoring
          </span>
        </li>
      </ul>

      {/* Filter */}
      <div className='mb-6 mt-6 flex flex-wrap items-center gap-4'>
        <div className='flex items-center gap-2'>
          <BsFilter className='text-blue-700' />
          <span className='font-semibold'>Filter:</span>
        </div>
        {/* Multi-select Location */}
        <div className='relative'>
          <button
            className='form-input flex w-48 items-center justify-between'
            type='button'
            onClick={e => {
              const dropdown = document.getElementById('dropdown-location');
              if (dropdown) dropdown.classList.toggle('hidden');
            }}
          >
            Kolom Lokasi
            <span className='ml-2'>&#9662;</span>
          </button>
          <div
            id='dropdown-location'
            className='absolute z-10 mt-1 hidden w-48 rounded border bg-white shadow-lg'
            tabIndex={-1}
            onBlur={e => {
              (e.target as HTMLElement).classList.add('hidden');
            }}
          >
            {allLocations.map(lokasi => (
              <label
                key={lokasi}
                className='flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100'
              >
                <input
                  type='checkbox'
                  className='mr-2 accent-blue-600'
                  checked={selectedLocations.includes(lokasi)}
                  onChange={() => toggleLocation(lokasi)}
                />
                {lokasi}
              </label>
            ))}
          </div>
        </div>
        {/* Multi-select Assets */}
        <div className='relative'>
          <button
            className='form-input flex w-48 items-center justify-between'
            type='button'
            onClick={e => {
              const dropdown = document.getElementById('dropdown-assets');
              if (dropdown) dropdown.classList.toggle('hidden');
            }}
          >
            Kolom Assets
            <span className='ml-2'>&#9662;</span>
          </button>
          <div
            id='dropdown-assets'
            className='absolute z-10 mt-1 hidden w-48 rounded border bg-white shadow-lg'
            tabIndex={-1}
            onBlur={e => {
              (e.target as HTMLElement).classList.add('hidden');
            }}
          >
            {sensors.map(sensor => (
              <label
                key={sensor.id}
                className='flex cursor-pointer items-center px-3 py-2 hover:bg-gray-100'
              >
                <input
                  type='checkbox'
                  className='mr-2 accent-blue-600'
                  checked={selectedAssets.includes(sensor.id)}
                  onChange={() => toggleAsset(sensor.id)}
                />
                {sensor.name}
              </label>
            ))}
          </div>
        </div>
        {/* Date Range - Sama seperti sensor health */}
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
                minDate: '2025-05-07',
                maxDate: '2025-05-17',
              }}
              value={dateRange}
              onChange={dates => setDateRange(dates)}
              className='form-input min-w-[220px] py-2 pl-8 pr-4'
              placeholder='Select date range'
            />
            <FaCalendarAlt
              className='absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400'
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Live Tracking & Status Sensor side by side */}
      <div className='mb-6 grid grid-cols-3 gap-6'>
        {/* Live Tracking (kiri, lebih lebar) */}
        <div className='panel col-span-2'>
          <div className='mb-2 flex items-center justify-between'>
            <h5 className='text-lg font-semibold'>Live Tracking</h5>
          </div>
          <div className='rounded-lg bg-white dark:bg-black'>
            {isMounted ? (
              <LoadScript googleMapsApiKey='AIzaSyCzc_7KuriOV7B8T6Kg79XXxWOMSpH8ERs'>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={filteredSensors.length === 1 ? 14 : 12}
                  options={{
                    mapTypeId: 'hybrid',
                    mapTypeControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {filteredSensors.map(sensor => {
                    // Pilih warna marker sesuai status
                    let markerColor = 'green';
                    if (sensor.data.status === 'Active') markerColor = 'green';
                    else if (sensor.data.status === 'Warning')
                      markerColor = 'yellow';
                    else if (sensor.data.status === 'Critical')
                      markerColor = 'red';
                    else if (sensor.data.status === 'Offline')
                      markerColor = 'gray';

                    // Google Maps marker icon url
                    const iconUrl =
                      markerColor === 'green'
                        ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        : markerColor === 'yellow'
                        ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        : markerColor === 'red'
                        ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        : 'http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png';

                    // Kode sensor (misal: 001)
                    const code = sensor.name.replace('Sensor ', '');

                    return (
                      <React.Fragment key={sensor.id}>
                        <Marker
                          position={sensor.position}
                          title={sensor.name}
                          icon={{
                            url: iconUrl,
                            scaledSize: {
                              width: 40,
                              height: 40,
                            } as google.maps.Size,
                            labelOrigin:
                              window.google && window.google.maps
                                ? new window.google.maps.Point(20, 15)
                                : undefined,
                          }}
                          label={{
                            text: code,
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            className: 'marker-label-custom',
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className='bg-white-light/30 dark:bg-dark grid min-h-[400px] place-content-center dark:bg-opacity-[0.08] '>
                <span className='inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white'></span>
              </div>
            )}
          </div>
          {/* Alamat sensor */}
          <div className='mt-2 text-center text-base font-medium text-gray-700 dark:text-white'>
            <span className='font-semibold'>{displaySensorName}</span> -{' '}
            {displayLokasi}
            <br />
            <span className='text-sm text-gray-500'>{displayAlamat}</span>
          </div>
          {/* Tambahan konten relevan di bawah Live Tracking */}
          <div className='mt-3 flex flex-col items-center gap-1'>
            <span className='text-xs text-gray-500 dark:text-gray-300'>
              Last Update: 17/05/2025 14:23
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-300'>
              Total Sensor Terpantau: {filteredSensors.length}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-300'>
              Status:{' '}
              <span
                className={
                  filteredSensors.length === 1
                    ? filteredSensors[0].data.status === 'Active'
                      ? 'text-green-600'
                      : filteredSensors[0].data.status === 'Warning'
                      ? 'text-yellow-600'
                      : filteredSensors[0].data.status === 'Offline'
                      ? 'text-blue-600'
                      : 'text-red-600'
                    : 'text-gray-600'
                }
              >
                {filteredSensors.length === 1
                  ? filteredSensors[0].data.status
                  : 'Multiple'}
              </span>
            </span>
          </div>
        </div>

        {/* Status Sensor */}
        <div className='panel flex flex-col justify-center'>
          {/* <h5 className="text-lg font-semibold mb-4 text-center">Status Sensor</h5> */}
          <div className='grid grid-cols-1 gap-2'>
            {filteredSensors.length === 1
              ? [
                  {
                    label: 'Active',
                    value: filteredSensors[0].data.status === 'Active' ? 1 : 0,
                    color: 'bg-green-500',
                  },
                  {
                    label: 'Warning',
                    value: filteredSensors[0].data.status === 'Warning' ? 1 : 0,
                    color: 'bg-yellow-400',
                  },
                  {
                    label: 'Critical',
                    value:
                      filteredSensors[0].data.status === 'Critical' ? 1 : 0,
                    color: 'bg-red-500',
                  },
                  {
                    label: 'Offline',
                    value: filteredSensors[0].data.status === 'Offline' ? 1 : 0,
                    color: 'bg-blue-400',
                  },
                ].map((status, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center rounded-lg px-4 py-2 shadow-md ${status.color} h-20`}
                  >
                    <MdSensors size={32} className='mb-1 text-white' />
                    <span className='text-lg font-bold text-white'>
                      {status.value}
                    </span>
                    <span className='text-white'>{status.label}</span>
                    {status.value === 1 && (
                      <span className='mt-1 text-center text-[10px] text-white'>
                        Last Update: 17/05/2025
                      </span>
                    )}
                  </div>
                ))
              : [
                  {
                    label: 'Active',
                    value: filteredSensors.filter(
                      s => s.data.status === 'Active',
                    ).length,
                    color: 'bg-green-500',
                  },
                  {
                    label: 'Warning',
                    value: filteredSensors.filter(
                      s => s.data.status === 'Warning',
                    ).length,
                    color: 'bg-yellow-400',
                  },
                  {
                    label: 'Critical',
                    value: filteredSensors.filter(
                      s => s.data.status === 'Critical',
                    ).length,
                    color: 'bg-red-500',
                  },
                  {
                    label: 'Offline',
                    value: filteredSensors.filter(
                      s => s.data.status === 'Offline',
                    ).length,
                    color: 'bg-blue-400',
                  },
                ].map((status, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center rounded-lg px-4 py-2 shadow-md ${status.color} h-26`}
                  >
                    <MdSensors size={32} className='mb-1 text-white' />
                    <span className='text-lg font-bold text-white'>
                      {status.value}
                    </span>
                    <span className='text-white'>{status.label}</span>
                  </div>
                ))}
          </div>

          {/* Notifikasi/History */}
          <div className='mt-6'>
            <div className='mb-2 flex items-center gap-2'>
              <FaBell className='text-yellow-500' />
              <span className='font-semibold'>Notifikasi Terbaru</span>
            </div>
            {/* Area notifikasi bisa diklik untuk buka modal */}
            <div
              className='max-h-40 cursor-pointer space-y-2 overflow-y-auto rounded transition hover:bg-yellow-50'
              title='Klik untuk lihat semua notifikasi'
              onClick={() => setNotifOpen(true)}
              tabIndex={0}
              style={{ outline: 'none' }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setNotifOpen(true);
              }}
            >
              {notifications.slice(0, 3).map((notif, idx) => (
                <div
                  key={idx}
                  className={`rounded px-2 py-1 text-xs shadow ${
                    notif.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : notif.type === 'offline'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <span className='font-bold'>{notif.time}</span> - {notif.msg}
                </div>
              ))}
            </div>
            {/* Floating modal notifikasi */}
            {notifOpen && (
              <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
                onClick={() => setNotifOpen(false)}
              >
                <div
                  className='relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-lg dark:bg-slate-800'
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className='absolute right-2 top-2 text-gray-500 hover:text-red-500'
                    onClick={() => setNotifOpen(false)}
                    aria-label='Tutup'
                  >
                    <IoClose size={24} />
                  </button>
                  <div className='p-4'>
                    <div className='mb-4 flex items-center gap-2'>
                      <FaBell className='text-yellow-500' />
                      <span className='text-lg font-semibold'>
                        Semua Notifikasi
                      </span>
                    </div>
                    <div className='space-y-2'>
                      {notifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className={`rounded px-2 py-1 text-xs shadow ${
                            notif.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : notif.type === 'offline'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <span className='font-bold'>{notif.time}</span> -{' '}
                          {notif.msg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Overview */}
      <div className='mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6'>
        {parameterLabels.map((label, idx) => {
          const key = label.split(' ')[0] as keyof typeof displayData;
          const value =
            typeof displayData[key] === 'number'
              ? displayData[key].toFixed(2)
              : displayData[key] ?? '';

          const percentage =
            label === 'pH'
              ? (Number(displayData[key]) / 14) * 100
              : (Number(displayData[key]) / 1000) * 100;

          return (
            <div
              key={label}
              className='relative flex flex-col items-center rounded-md bg-white bg-opacity-85 p-6 shadow-md dark:bg-[#2D3858] dark:bg-opacity-90'
              style={{ minWidth: 180, minHeight: 180 }}
            >
              <CircularProgressbar
                value={Math.min(percentage, 100)}
                text='' // Hapus text dari tengah lingkaran
                styles={{
                  path: { stroke: '#00ab55' },
                  trail: { stroke: '#d6d6d6' },
                }}
              />
              <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
                <div className='mb-1 text-2xl'>{parameterIcons[idx]}</div>
                <div className='text-xl font-bold text-black dark:text-white'>
                  {value}
                </div>
                <p className='text-sm font-semibold text-gray-700 dark:text-white'>
                  {label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel Data Sensor Terbaru */}
      <div className='panel mb-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h5 className='text-lg font-semibold'>Data Sensor Terbaru</h5>
          <Dropdown
            offset={[0, 1]}
            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
            button={
              <IconHorizontalDots className='hover:!text-primary text-black/70 dark:text-white/70' />
            }
          >
            <ul>
              <li>
                <button type='button' onClick={() => handleExport('csv')}>
                  Export CSV
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('excel')}>
                  Export Excel
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('pdf')}>
                  Export PDF
                </button>
              </li>
            </ul>
          </Dropdown>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-4 py-2 text-left'>Sensor</th>
                <th className='px-4 py-2 text-left'>Lokasi</th>
                <th className='px-4 py-2 text-left'>pH</th>
                <th className='px-4 py-2 text-left'>DO</th>
                <th className='px-4 py-2 text-left'>Turbidity</th>
                <th className='px-4 py-2 text-left'>Conductivity</th>
                <th className='px-4 py-2 text-left'>Temperature</th>
                <th className='px-4 py-2 text-left'>TDS</th>
                <th className='px-4 py-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.length === 1 ? (
                <tr className='hover:bg-gray-100 dark:hover:bg-gray-800'>
                  <td className='px-4 py-2'>{filteredSensors[0].name}</td>
                  <td className='px-4 py-2'>{filteredSensors[0].lokasi}</td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.pH).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.DO).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.Turbidity).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.Conductivity).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.Temperature).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {Number(filteredSensors[0].data.TDS).toFixed(2)}
                  </td>
                  <td className='px-4 py-2'>
                    {filteredSensors[0].data.status}
                  </td>
                </tr>
              ) : (
                filteredSensors.map(sensor => (
                  <tr
                    key={sensor.id}
                    className='hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    <td className='px-4 py-2'>{sensor.name}</td>
                    <td className='px-4 py-2'>{sensor.lokasi}</td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.pH).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.DO).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.Turbidity).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.Conductivity).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.Temperature).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>
                      {Number(sensor.data.TDS).toFixed(2)}
                    </td>
                    <td className='px-4 py-2'>{sensor.data.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grafik Tren */}
      <div className='panel mb-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h5 className='text-lg font-semibold'>Tren Parameter Kualitas Air</h5>
          <Dropdown
            offset={[0, 1]}
            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
            button={
              <IconHorizontalDots className='hover:!text-primary text-black/70 dark:text-white/70' />
            }
          >
            <ul>
              <li>
                <button type='button' onClick={() => handleExport('csv')}>
                  Export CSV
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('excel')}>
                  Export Excel
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('pdf')}>
                  Export PDF
                </button>
              </li>
            </ul>
          </Dropdown>
        </div>
        <div>
          {isMounted ? (
            <ReactApexChart
              series={chartSeries}
              options={chartOptions}
              type='line'
              height={320}
              width='100%'
            />
          ) : (
            <div className='bg-white-light/30 dark:bg-dark grid min-h-[320px] place-content-center dark:bg-opacity-[0.08] '>
              <span className='inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white'></span>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart: Perbandingan Parameter Antar Sensor */}
      <div className='panel mb-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h5 className='text-lg font-semibold'>
            Perbandingan Parameter Antar Sensor
          </h5>
          <Dropdown
            offset={[0, 1]}
            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
            button={
              <IconHorizontalDots className='hover:!text-primary text-black/70 dark:text-white/70' />
            }
          >
            <ul>
              <li>
                <button type='button' onClick={() => handleExport('csv')}>
                  Export CSV
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('excel')}>
                  Export Excel
                </button>
              </li>
              <li>
                <button type='button' onClick={() => handleExport('pdf')}>
                  Export PDF
                </button>
              </li>
            </ul>
          </Dropdown>
        </div>
        <div>
          {isMounted ? (
            <ReactApexChart
              type='bar'
              height={320}
              series={[
                {
                  name: 'pH',
                  data: sensors.map(s => s.data.pH),
                },
                {
                  name: 'DO',
                  data: sensors.map(s => s.data.DO),
                },
                {
                  name: 'Turbidity',
                  data: sensors.map(s => s.data.Turbidity),
                },
                {
                  name: 'Conductivity',
                  data: sensors.map(s => s.data.Conductivity),
                },
                {
                  name: 'Temperature',
                  data: sensors.map(s => s.data.Temperature),
                },
                {
                  name: 'TDS',
                  data: sensors.map(s => s.data.TDS),
                },
              ]}
              options={{
                chart: {
                  type: 'bar',
                  stacked: false,
                  toolbar: { show: false },
                },
                xaxis: {
                  categories: sensors.map(s => s.name),
                  title: { text: 'Sensor' },
                },
                yaxis: { title: { text: 'Nilai' } },
                legend: { position: 'top' },
                tooltip: { y: { formatter: (val: number) => val?.toFixed(2) } },
                colors: [
                  '#00ab55',
                  '#1e90ff',
                  '#ff9800',
                  '#e91e63',
                  '#43a047',
                  '#9c27b0',
                ],
              }}
            />
          ) : (
            <div className='bg-white-light/30 dark:bg-dark grid min-h-[320px] place-content-center dark:bg-opacity-[0.08] '>
              <span className='inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white'></span>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .marker-label-custom {
          background: rgba(30, 30, 30, 0.85);
          padding: 2px 10px;
          border-radius: 8px;
          font-weight: 700;
          text-shadow: 0 1px 2px #000;
          letter-spacing: 1px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          margin-top: -8px;
        }
        /* Dropdown multi-select style */
        #dropdown-location,
        #dropdown-assets {
          max-height: 250px;
          overflow-y: auto;
        }

        /* Flatpickr custom styling to match design */
        .flatpickr-calendar {
          background: ${isDark ? '#1b2e4b' : '#ffffff'};
          border: 1px solid ${isDark ? '#253662' : '#e0e6ed'};
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          border-radius: 8px;
        }

        .flatpickr-calendar .flatpickr-months {
          background: ${isDark ? '#1b2e4b' : '#ffffff'};
          border-bottom: 1px solid ${isDark ? '#253662' : '#e0e6ed'};
        }

        .flatpickr-calendar .flatpickr-current-month {
          color: ${isDark ? '#ffffff' : '#000000'};
        }

        .flatpickr-calendar .flatpickr-weekday {
          color: ${isDark ? '#888ea8' : '#888ea8'};
          background: ${isDark ? '#253662' : '#f1f2f3'};
        }

        .flatpickr-calendar .flatpickr-day {
          color: ${isDark ? '#bfc9d4' : '#515365'};
        }

        .flatpickr-calendar .flatpickr-day:hover {
          background: ${isDark ? '#253662' : '#e0e6ed'};
        }

        .flatpickr-calendar .flatpickr-day.selected {
          background: #4361ee;
          border-color: #4361ee;
        }

        .flatpickr-calendar .flatpickr-day.inRange {
          background: rgba(67, 97, 238, 0.1);
          border-color: transparent;
        }

        .flatpickr-calendar .flatpickr-day.startRange,
        .flatpickr-calendar .flatpickr-day.endRange {
          background: #4361ee;
          border-color: #4361ee;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ComponentsDashboardGeneral;
