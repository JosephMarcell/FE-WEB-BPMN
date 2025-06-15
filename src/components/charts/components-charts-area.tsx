'use client';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

const ComponentsChartsArea = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // areaChartOptions
  const areaChart: { series: ApexOptions['series']; options: ApexOptions } = {
    series: [
      {
        name: 'Income',
        data: [
          16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000,
          14000, 17000,
        ],
      },
    ],
    options: {
      chart: {
        type: 'area',
        height: 300,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#805dca'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      xaxis: {
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed',
        },
      },
      yaxis: {
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -40 : 0,
        },
      },
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      legend: {
        horizontalAlign: 'left',
      },
      grid: {
        borderColor: isDark ? '#191E3A' : '#E0E6ED',
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Simple Area'
      codeHighlight={`const areaChartOptions = {
  series: [{ name: 'Income', data: [16800, 16800, 15500, ...] }],
  options: { chart: { type: 'area', height: 300, ... }, ... }
};

import ReactApexChart from 'react-apexcharts';
<ReactApexChart series={areaChartOptions.series} options={areaChartOptions.options} className="rounded-lg" type="area" height={300} width={'100%'} />`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={areaChart.series}
            options={areaChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='area'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsArea;
