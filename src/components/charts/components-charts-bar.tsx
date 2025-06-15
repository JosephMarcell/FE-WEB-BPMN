'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface BarChartOptions {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      height: number;
      type: 'bar';
      zoom: {
        enabled: boolean;
      };
      toolbar: {
        show: boolean;
      };
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      show: boolean;
      width: number;
    };
    colors: string[];
    xaxis: {
      categories: string[];
      axisBorder: {
        color: string;
      };
    };
    yaxis: {
      opposite: boolean;
      reversed: boolean;
    };
    grid: {
      borderColor: string;
    };
    plotOptions: {
      bar: {
        horizontal: boolean;
      };
    };
    fill: {
      opacity: number;
    };
  };
}

const ComponentsChartsBar = () => {
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

  const barChart: BarChartOptions = {
    series: [
      {
        name: 'Sales',
        data: [44, 55, 41, 67, 22, 43, 21, 70],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: 'bar',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      colors: ['#4361ee'],
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed',
        },
      },
      yaxis: {
        opposite: isRtl,
        reversed: isRtl,
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      fill: {
        opacity: 0.8,
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Simple Bar'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

<div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={barChart.series}
            options={barChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='bar'
            height={300}
            width='100%'
          />
        )}
      </div>
// barChartOptions
const barChart: any = {
    series: [
        {
            name: 'Sales',
            data: [44, 55, 41, 67, 22, 43, 21, 70]
        }
    ],
    options: {
        chart: {
            height: 300,
            type: 'bar',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 1
        },
        colors: ['#4361ee'],
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed'
        }
      },
        yaxis: {
            opposite: isRtl,
            reversed: isRtl
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed'
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        fill: {
            opacity: 0.8
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={barChart.series}
            options={barChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='bar'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsBar;
