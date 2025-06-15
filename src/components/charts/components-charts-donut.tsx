'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import PanelCodeHighlight from '@/components/panel-code-highlight';

interface DonutChartOptions {
  series: number[];
  options: {
    chart: {
      height: number;
      type: 'donut';
      zoom: {
        enabled: boolean;
      };
      toolbar: {
        show: boolean;
      };
    };
    stroke: {
      show: boolean;
    };
    labels: string[];
    colors: string[];
    responsive: {
      breakpoint: number;
      options: {
        chart: {
          width: number;
        };
      };
    }[];
    legend: {
      position: 'bottom' | 'top' | 'left' | 'right';
    };
  };
}

const ComponentsChartsDonut = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // donutChartOptions
  const donutChart: DonutChartOptions = {
    series: [44, 55, 13],
    options: {
      chart: {
        height: 300,
        type: 'donut',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        show: false,
      },
      labels: ['Team A', 'Team B', 'Team C'],
      colors: ['#4361ee', '#805dca', '#e2a03f'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      legend: {
        position: 'bottom',
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Basic Donut'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

 {isMounted && (
          <ReactApexChart
            series={donutChart.series}
            options={donutChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='donut'
            height={300}
            width='100%'
          />
        )}
        
// donutChartOptions
const donutChart: any = {
    series: [44, 55, 13],
    options: {
        chart: {
            height: 300,
            type: 'donut',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        stroke: {
            show: false
        },
        labels: ['Team A', 'Team B', 'Team C'],
        colors: ['#4361ee', '#805dca', '#e2a03f'],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    }
                }
            }
        ],
        legend: {
            position: 'bottom'
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={donutChart.series}
            options={donutChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='donut'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsDonut;
