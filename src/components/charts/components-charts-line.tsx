'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface LineChartOptions {
  series: {
    name: string;
    data: number[];
  }[];
  options: {
    chart: {
      height: number;
      type: 'line';
      toolbar: {
        show: boolean;
      };
    };
    colors: string[];
    tooltip?: {
      marker: {
        show: boolean;
      };
      y?: {
        formatter?: (val: number) => string;
      };
    };
    stroke: {
      width: number;
      curve: 'smooth';
    };
    xaxis: {
      categories: string[];
      axisBorder: {
        color: string;
      };
    };
    yaxis: {
      opposite: boolean;
      labels: {
        offsetX: number;
      };
    };
    grid: {
      borderColor: string;
    };
  };
}

const ComponentsChartsLine = () => {
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

  // lineChartOptions
  const lineChart: LineChartOptions = {
    series: [
      {
        name: 'Sales',
        data: [45, 55, 75, 25, 45, 110],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      colors: ['#4361EE'],
      tooltip: {
        marker: {
          show: false, // Correctly specifying marker as an object
        },
        y: {
          formatter: (val: number) => `$${val}`,
        },
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed',
        },
      },
      yaxis: {
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -20 : 0,
        },
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
      },
    },
  };

  return (
    <PanelCodeHighlight
      title='Simple Line'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={lineChart.series} options={lineChart.options} className="rounded-lg bg-white dark:bg-black" type="line" height={300} width={'100%'} /> }

// lineChartOptions
const lineChart: any = {
    series: [
        {
            name: 'Sales',
            data: [45, 55, 75, 25, 45, 110]
        }
    ],
    options: {
        chart: {
            height: 300,
            type: 'line',
            toolbar: false
        },
        colors: ['#4361EE'],
        tooltip: {
            marker: false,
            y: {
                formatter(number: number) {
                    return '$' + number;
                }
            }
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed'
            }
        },
        yaxis: {
            opposite: isRtl,
            labels: {
                offsetX: isRtl ? -20 : 0
            }
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed'
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={lineChart.series}
            options={lineChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='line'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsLine;
