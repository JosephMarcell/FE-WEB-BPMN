'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface YRange {
  min: number;
  max: number;
}

interface BubbleSeriesData {
  name: string;
  data: [number, number, number][];
}

interface BubbleChartOptions {
  chart: {
    height: number;
    type: 'bubble';
    zoom: {
      enabled: boolean;
    };
    toolbar: {
      show: boolean;
    };
  };
  colors: string[];
  dataLabels: {
    enabled: boolean;
  };
  xaxis: {
    tickAmount: number;
    type: 'category';
    axisBorder: {
      color: string;
    };
  };
  yaxis: {
    max: number;
    opposite: boolean;
    labels: {
      offsetX: number;
    };
  };
  grid: {
    borderColor: string;
  };
  tooltip: {
    theme: 'dark' | 'light';
  };
  stroke: {
    colors: string[];
  };
  fill: {
    opacity: number;
  };
}

interface BubbleChart {
  series: BubbleSeriesData[];
  options: BubbleChartOptions;
}

const ComponentsChartsBubble = () => {
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

  // bubble chart data
  const generateData = (
    baseval: number,
    count: number,
    yrange: YRange,
  ): [number, number, number][] => {
    let i = 0;
    const series: [number, number, number][] = [];
    while (i < count) {
      const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  };

  // bubbleChartOptions
  const bubbleChart: BubbleChart = {
    series: [
      {
        name: 'Bubble1',
        data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60,
        }),
      },
      {
        name: 'Bubble2',
        data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
          min: 10,
          max: 60,
        }),
      },
    ],
    options: {
      chart: {
        height: 300,
        type: 'bubble',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#4361ee', '#00ab55'],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        tickAmount: 12,
        type: 'category',
        axisBorder: {
          color: isDark ? '#191e3a' : '#e0e6ed',
        },
      },
      yaxis: {
        max: 70,
        opposite: isRtl,
        labels: {
          offsetX: isRtl ? -10 : 0,
        },
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
      },
      stroke: {
        colors: isDark ? ['#191e3a'] : ['#e0e6ed'],
      },
      fill: {
        opacity: 0.85,
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Bubble Chart'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={bubbleChart.series} options={bubbleChart.options} className="rounded-lg bg-white dark:bg-black" type="bubble" height={300} width={'100%'} />}

// bubbleChartOptions
const bubbleChart: any = {
    series: [
        {
            name: 'Bubble1',
            data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                min: 10,
                max: 60
            })
        },
        {
            name: 'Bubble2',
            data: generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
                min: 10,
                max: 60
            })
        }
    ],
    options: {
        chart: {
            height: 300,
            type: 'bubble',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#4361ee', '#00ab55'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            tickAmount: 12,
            type: 'category',
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed'
            }
        },
        yaxis: {
            max: 70,
            opposite: isRtl,
            labels: {
                offsetX: isRtl ? -10 : 0
            }
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed'
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        },
        stroke: {
            colors: isDark ? ['#191e3a'] : ['#e0e6ed']
        },
        fill: {
            opacity: 0.85
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={bubbleChart.series}
            options={bubbleChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='bubble'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsBubble;
