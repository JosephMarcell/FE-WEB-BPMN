import Chart from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from '@/store'; // Import your root state type for Redux

const LineChartComponent = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const myChartRef = useRef<Chart | null>(null); // Store chart instance

  // Get the dark mode state from Redux
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    const textColor = isDark ? '#fff' : '#000'; // Set text color based on theme
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'; // Set grid color based on theme

    if (ctx && chartRef.current) {
      // Destroy the existing chart if it exists to avoid reusing the canvas
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }

      // Create new chart instance
      myChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'TDS',
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
            {
              label: 'pH',
              data: [28, 48, 40, 19, 86, 27, 90],
              borderColor: 'rgba(153,102,255,1)',
              fill: false,
            },
            {
              label: 'DO',
              data: [18, 48, 77, 9, 100, 27, 40],
              borderColor: 'rgba(255,159,64,1)',
              fill: false,
            },
            {
              label: 'Turbiditas',
              data: [12, 42, 64, 85, 23, 77, 12],
              borderColor: 'rgba(54,162,235,1)',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: textColor, // Dynamic legend text color
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColor, // Dynamic x-axis label color
              },
              grid: {
                color: gridColor, // Dynamic x-axis grid color
              },
            },
            y: {
              ticks: {
                color: textColor, // Dynamic y-axis label color
              },
              grid: {
                color: gridColor, // Dynamic y-axis grid color
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance
    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [isDark]); // Depend on `isDark` to update the chart

  return (
    <div className='relative h-[300px]'>
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChartComponent;
