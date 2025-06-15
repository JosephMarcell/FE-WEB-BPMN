'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface MixedChartSeries {
  name: string;
  type: 'line' | 'area' | 'bar' | 'column';
  data: number[];
}

interface MixedChartOptions {
  chart: {
    height: number;
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
  colors: string[];
  stroke: {
    width: number[];
    curve: 'smooth';
  };
  plotOptions: {
    bar: {
      columnWidth: string;
    };
  };
  fill: {
    opacity: number[];
  };
  labels: string[];
  markers: {
    size: number;
  };
  xaxis: {
    type: 'datetime';
    axisBorder: {
      color: string;
    };
  };
  yaxis: {
    title: {
      text: string;
    };
    min: number;
    opposite: boolean;
    labels: {
      offsetX: number;
    };
  };
  grid: {
    borderColor: string;
  };
  tooltip: {
    shared: boolean;
    intersect: boolean;
    theme: 'dark' | 'light';
  };
  legend: {
    itemMargin: {
      horizontal: number;
      vertical: number;
    };
  };
}

interface MixedChart {
  series: MixedChartSeries[];
  options: MixedChartOptions;
}

const ComponentsChartsMixed = () => {
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

  // mixedChartOptions
  const mixedChart: MixedChart = {
    series: [
      {
        name: 'TEAM A',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: 'TEAM B',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: 'TEAM C',
        type: 'line',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
    options: {
      chart: {
        height: 300,
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
      colors: ['#2196f3', '#00ab55', '#4361ee'],
      stroke: {
        width: [0, 2, 2],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      fill: {
        opacity: [1, 0.25, 1],
      },

      labels: [
        '01/01/2022',
        '02/01/2022',
        '03/01/2022',
        '04/01/2022',
        '05/01/2022',
        '06/01/2022',
        '07/01/2022',
        '08/01/2022',
        '09/01/2022',
        '10/01/2022',
        '11/01/2022',
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed',
        },
      },
      yaxis: {
        title: {
          text: 'Points',
        },
        min: 0,
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -10 : 0,
        },
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: isDark ? 'dark' : 'light',
      },
      legend: {
        itemMargin: {
          horizontal: 4,
          vertical: 8,
        },
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Mixed'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={mixedChart.series} options={mixedChart.options} className="rounded-lg bg-white dark:bg-black" type="bar" height={300} width={'100%'} />}

const mixedChart: any = {
    series: [
        {
            name: 'TEAM A',
            type: 'column',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
        },
        {
            name: 'TEAM B',
            type: 'area',
            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        },
        {
            name: 'TEAM C',
            type: 'line',
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }
    ],
    options: {
        chart: {
            height: 300,
            // stacked: false,
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
        colors: ['#2196f3', '#00ab55', '#4361ee'],
        stroke: {
            width: [0, 2, 2],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '50%'
            }
        },
        fill: {
            opacity: [1, 0.25, 1]
        },

        labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022', '07/01/2022', '08/01/2022', '09/01/2022', '10/01/2022', '11/01/2022'],
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed'
            }
        },
        yaxis: {
            title: {
                text: 'Points'
            },
            min: 0,
            opposite: isRtl,
            labels: {
                offsetX: isRtl ? -10 : 0
            }
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed'
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: isDark ? 'dark' : 'light'
        },
        legend: {
            itemMargin: {
                horizontal: 4,
                vertical: 8
            }
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={mixedChart.series}
            options={mixedChart.options}
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

export default ComponentsChartsMixed;
