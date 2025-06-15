'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface RadarChartSeries {
  name: string;
  data: number[];
}

interface RadarChartOptions {
  chart: {
    height: number;
    type: 'radar';
    zoom: {
      enabled: boolean;
    };
    toolbar: {
      show: false;
    };
  };
  colors: string[];
  xaxis: {
    categories: string[];
  };
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: string;
        connectorColors: string;
      };
    };
  };
  tooltip: {
    theme: 'dark' | 'light';
  };
}

interface RadarChart {
  series: RadarChartSeries[];
  options: RadarChartOptions;
}

const ComponentsChartsRadar = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // radarChartOptions
  const radarChart: RadarChart = {
    series: [
      {
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: 'radar',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#4361ee'],
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: isDark ? '#191e3a' : '#e0e6ed',
            connectorColors: isDark ? '#191e3a' : '#e0e6ed',
          },
        },
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Basic Radar'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={radarChart.series} options={radarChart.options} className="rounded-lg bg-white dark:bg-black" type="radar" height={300} width={'100%'} />}

// radarChartOptions
const radarChart: any = {
    series: [
        {
            name: 'Series 1',
            data: [80, 50, 30, 40, 100, 20]
        }
    ],
    options: {
        chart: {
            height: 300,
            type: 'radar',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#4361ee'],
        xaxis: {
            categories: ['January', 'February', 'March', 'April', 'May', 'June']
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: isDark ? '#191e3a' : '#e0e6ed',
                    connectorColors: isDark ? '#191e3a' : '#e0e6ed'
                }
            }
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={radarChart.series}
            options={radarChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='radar'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsRadar;
