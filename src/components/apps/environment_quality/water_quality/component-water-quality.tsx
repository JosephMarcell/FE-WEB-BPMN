'use client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import DatePicker from 'react-datepicker';
import { BsThermometerSun } from 'react-icons/bs';
import {
  FaCompass,
  FaGlobe,
  FaTachometerAlt,
  FaTint,
  FaWater,
  FaWind,
} from 'react-icons/fa';
import { GiMountaintop } from 'react-icons/gi';
import { TbDrone } from 'react-icons/tb';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-circular-progressbar/dist/styles.css';

import LineChartComponent from '@/components/apps/environment_quality/water_quality/_components/line-chart';

const center = {
  lat: 1.227273,
  lng: 104.5534682,
};

interface WaterQualityData {
  TDS: number;
  pH: number;
  DO: number;
  Turbidity: number;
  Temperature: number;
  measurement_time: string;
}

const ComponentWaterQuality = () => {
  const [searchValue, setSearchValue] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [, setWaterQualityData] = useState<WaterQualityData | null>(null);
  const [, setError] = useState<string | null>(null);
  const [progressBarData, setProgressBarData] = useState([
    { label: 'TDS', value: 0, icon: <FaTachometerAlt size={55} /> },
    { label: 'pH', value: 0, icon: <FaTint size={55} /> },
    { label: 'DO', value: 0, icon: <FaWater size={55} /> },
    { label: 'Turbidity', value: 0, icon: <FaWind size={55} /> },
    { label: 'Temperature', value: 0, icon: <BsThermometerSun size={55} /> },
  ]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue) {
      // eslint-disable-next-line no-console
      console.log('Searching for:', searchValue);
      // Add your search functionality here
    }
  };

  const fetchFilteredWaterQualityData = useCallback(async () => {
    try {
      const authToken = Cookies.get('authToken');
      if (!authToken) {
        setError('Authorization token is missing');
        return;
      }

      const today = new Date();
      const [startDate, endDate] = dateRange;

      const effectiveStartDate = startDate || today;
      const effectiveEndDate = endDate || today;

      const formattedStartDate = effectiveStartDate.toISOString().split('T')[0];
      const formattedEndDate = effectiveEndDate.toISOString().split('T')[0];

      let url = `http://localhost:3040/api/monitoring/activity/filter?category=WATER_QUALITY_MEASUREMENT`;
      if (startDate && endDate) {
        url += `&date=${formattedStartDate} - ${formattedEndDate}`;
      } else {
        url += `&date=${formattedStartDate}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch water quality data');
      }

      const result = await response.json();
      if (result[0].data && result[0].data.length > 0) {
        const measurements = result[0].data[0].measurements[0];
        setWaterQualityData(measurements);
        setProgressBarData([
          {
            label: 'TDS',
            value: measurements.TDS,
            icon: <FaTachometerAlt size={55} />,
          },
          { label: 'pH', value: measurements.pH, icon: <FaTint size={55} /> },
          { label: 'DO', value: measurements.DO, icon: <FaWater size={55} /> },
          {
            label: 'Turbidity',
            value: measurements.Turbidity,
            icon: <FaWind size={55} />,
          },
          {
            label: 'Temperature',
            value: measurements.Temperature,
            icon: <BsThermometerSun size={55} />,
          },
        ]);
      } else {
        setWaterQualityData(null);
        setError('No water quality data available for the selected date.');
      }
    } catch (error) {
      console.error('Error fetching water quality data:', error);
      setError('Could not fetch water quality data');
    }
  }, [dateRange]);

  useEffect(() => {
    fetchFilteredWaterQualityData();
  }, [fetchFilteredWaterQualityData]);

  return (
    <div className='relative w-full lg:h-[1210px]'>
      <ul className='mb-6 flex space-x-2 rtl:space-x-reverse'>
        <li>
          <Link href='/' className='text-primary hover:underline'>
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Environment Quality</span>
        </li>
      </ul>

      <div className='cardsoverlay absolute left-4 right-4 top-16 z-10 flex justify-center gap-12'>
        <div className='flex justify-center gap-4'>
          <div className='flex w-fit flex-col items-center rounded-md bg-white p-4 font-bold text-black shadow-md dark:bg-black dark:text-white'>
            <div className='flex'>
              <TbDrone className='mr-3 text-yellow-400' size={24} />
              <p className='text-sm'>Drone Serial Number</p>
            </div>
            <h2 className='text-xl font-semibold text-blue-900 dark:text-white'>
              #AE3460
            </h2>
          </div>
          <div className='flex w-fit flex-col items-center rounded-md bg-white p-4 font-bold text-black shadow-md dark:bg-black dark:text-white'>
            <div className='flex'>
              <FaGlobe className='mr-3 text-yellow-400' size={24} />
              <p className='text-sm'>Latitude</p>
            </div>
            <h2 className='text-xl font-semibold text-blue-900 dark:text-white'>
              1.221836
            </h2>
          </div>
          <div className='flex w-fit flex-col items-center rounded-md bg-white p-4 font-bold text-black shadow-md dark:bg-black dark:text-white'>
            <div className='flex'>
              <FaCompass className='mr-3 text-yellow-400' size={24} />
              <p className='text-sm'>Longitude</p>
            </div>
            <h2 className='text-xl font-semibold text-blue-900 dark:text-white'>
              104.557549
            </h2>
          </div>
          <div className='flex w-fit flex-col items-center rounded-md bg-white p-4 font-bold text-black shadow-md dark:bg-black dark:text-white'>
            <div className='flex'>
              <GiMountaintop className='mr-3 text-yellow-400' size={24} />
              <p className='text-sm'>Altitude</p>
            </div>
            <h2 className='text-xl font-semibold text-blue-900 dark:text-white'>
              400 feet
            </h2>
          </div>
        </div>
        <div className='absolute right-1'>
          <form
            onSubmit={handleSearch}
            className='flex items-center rounded-md bg-white p-2 text-blue-950 shadow-md transition-all duration-300 dark:bg-black dark:text-white'
            style={{ width: searchValue.length > 0 ? '300px' : '200px' }}
          >
            <input
              type='text'
              placeholder='Search...'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className='w-full border-none bg-transparent text-blue-950 placeholder-blue-950 outline-none dark:text-white dark:placeholder-white'
            />
            <button
              type='submit'
              className='ml-2 rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-950 dark:bg-purple-500 dark:hover:bg-purple-600'
            >
              Go
            </button>
          </form>
        </div>
      </div>

      <MapContainer
        zoomControl={false}
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' />
        <TileLayer
          url={`https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIAMAPS_API_KEY}`}
          opacity={0.8}
        />
      </MapContainer>

      {/* Bottom Overlay for Water Quality */}
      <div className='absolute bottom-0 z-10 w-full rounded-t-lg bg-white bg-opacity-85 p-4 shadow-md dark:bg-[#04103A] dark:bg-opacity-75'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Environment Quality</h3>
          <div className='w-[170px]'>
            {' '}
            <DatePicker
              selected={dateRange[0]}
              onChange={(update: [Date | null, Date | null]) => {
                setDateRange(update);
              }}
              startDate={dateRange[0] || undefined}
              endDate={dateRange[1] || undefined}
              selectsRange
              isClearable
              placeholderText='Select date range'
              className='w-full rounded border p-2 pr-10 text-sm'
              dateFormat='yyyy-MM-dd'
            />
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          {/* Circular Charts */}
          <div className='flex flex-row gap-6'>
            {progressBarData.map((data, index) => (
              <div
                key={index}
                className='panel flex h-full flex-col items-center justify-center bg-white bg-opacity-85 dark:bg-[#2D3858] dark:bg-opacity-90'
                // style={{ width: '15vw', height: '15vw' }}
              >
                <CircularProgressbar
                  value={data.value}
                  styles={{
                    path: { stroke: `rgba(62, 152, 199, ${data.value})` },
                    text: {
                      fill: '#f88',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transform: 'translate(50%, -50%)',
                    },
                    trail: { stroke: '#d6d6d6' },
                  }}
                />
                {/* Icon and label inside the progress bar */}
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  {data.icon}
                  <p className='text-base text-gray-700 dark:text-white'>
                    {data.label}
                  </p>
                </div>
                {/* Percentage at the edge of the circle */}
                <div className='absolute right-6 top-7 rounded-3xl bg-white px-3 py-1 text-base shadow-sm'>
                  {data.value}%
                </div>
              </div>
            ))}
          </div>
          {/* Line Chart */}
          <div className='flex w-full gap-6'>
            <div className='panel h-full w-4/6 self-center bg-opacity-85 xl:col-span-2 dark:bg-[#2D3858] dark:bg-opacity-90'>
              <LineChartComponent />
            </div>
            <div className='panel flex h-full w-2/6 flex-col bg-opacity-85 dark:bg-[#2D3858] dark:bg-opacity-90'>
              <div className=''></div>
              <div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  et hendrerit purus. Etiam id auctor dolor. Aliquam in mauris
                  venenatis, rutrum velit eu, volutpat orci. Curabitur fermentum
                  ac nunc mollis mattis. Duis non nisi nec libero fringilla
                  lobortis at{' '}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentWaterQuality;
