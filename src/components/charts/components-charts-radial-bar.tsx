'use client';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import PanelCodeHighlight from '@/components/panel-code-highlight';

import { IRootState } from '@/store';

interface RadialBarChartOptions {
  chart: {
    height: number;
    type: 'radialBar';
    zoom: {
      enabled: boolean;
    };
    toolbar: {
      show: boolean;
    };
  };
  colors: string[];
  grid: {
    borderColor: string;
  };
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: string;
        };
        value: {
          fontSize: string;
        };
        total: {
          show: boolean;
          label: string;
          formatter?: (opts: unknown) => string;
        };
      };
    };
  };
  labels: string[];
  fill: {
    opacity: number;
  };
}

interface RadialBarChart {
  series: number[];
  options: RadialBarChartOptions;
}

const ComponentsChartsRadialBar = () => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // radialBarChartOptions
  const radialBarChart: RadialBarChart = {
    series: [44, 55, 67],
    options: {
      chart: {
        height: 300,
        type: 'radialBar',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#4361ee', '#805dca', '#e2a03f'],
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return 'Total: 249';
              },
            },
          },
        },
      },
      labels: ['Apples', 'Oranges', 'Bananas'],
      fill: {
        opacity: 0.85,
      },
    },
  };

  return (
    <PanelCodeHighlight
      title='Radial Bar'
      codeHighlight={`import ReactApexChart from 'react-apexcharts';

{isMounted && <ReactApexChart series={radialBarChart.series} options={radialBarChart.options} className="rounded-lg bg-white dark:bg-black" type="radialBar" height={300} width={'100%'} />}

// radialBarChartOptions
const radialBarChart: any = {
    series: [44, 55, 41],
    options: {
        chart: {
            height: 300,
            type: 'radialBar',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        colors: ['#4361ee', '#805dca', '#e2a03f'],
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed'
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px'
                    },
                    value: {
                        fontSize: '16px'
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function () {
                            return 249;
                        }
                    }
                }
            }
        },
        labels: ['Apples', 'Oranges', 'Bananas'],
        fill: {
            opacity: 0.85
        }
    }
};`}
    >
      <div className='mb-5'>
        {isMounted && (
          <ReactApexChart
            series={radialBarChart.series}
            options={radialBarChart.options}
            className='rounded-lg bg-white dark:bg-black'
            type='radialBar'
            height={300}
            width='100%'
          />
        )}
      </div>
    </PanelCodeHighlight>
  );
};

export default ComponentsChartsRadialBar;
