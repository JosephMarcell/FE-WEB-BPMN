'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import PanelCodeHighlight from '@/components/panel-code-highlight';

interface PieChartOptions {
  chart: {
    height: number;
    type: 'pie';
    zoom: {
      enabled: boolean;
    };
    toolbar: {
      show: boolean;
    };
  };
  labels: string[];
  colors: string[];
  responsive: Array<{
    breakpoint: number;
    options: {
      chart: {
        width: number;
      };
    };
  }>;
  stroke: {
    show: boolean;
  };
  legend: {
    position: 'bottom' | 'top' | 'left' | 'right';
  };
}

interface PieChart {
  series: number[];
  options: PieChartOptions;
}

const ComponentsChartsPie = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // pieChartOptions
  const pieChart: PieChart = {
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        height: 300,
        type: 'pie',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
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
      stroke: {
        show: false,
      },
      legend: {
        position: 'bottom',
      },
    },
  };
  return (
    <PanelCodeHighlight
      title='Basic Pie'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={pieChart.series} options={pieChart.options} className="rounded-lg bg-white dark:bg-black" type="pie" height={300} width={'100%'} />}

// pieChartOptions
const pieChart: any = {
    series: [44, 55, 13, 43, 22],
    options: {
        chart: {
            height: 300,
            type: 'pie',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f'],
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
        stroke: {
            show: false
        },
        legend: {
            position: 'bottom'
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={pieChart.series}
            options={pieChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='pie'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsPie;
