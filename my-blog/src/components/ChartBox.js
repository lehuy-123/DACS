import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartBox = ({ data }) => {
  const monthData = Array(12).fill(0);

  data.forEach((item) => {
    const monthIndex = item._id - 1;
    monthData[monthIndex] = item.count;
  });

  const chartData = {
    labels: [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ],
    datasets: [
      {
        label: 'Bài viết',
        data: monthData,
        backgroundColor: '#6c5ce7',
        borderRadius: 6,
        barThickness: 28
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#2d3436' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#2d3436'
        }
      },
      x: {
        ticks: {
          color: '#2d3436'
        }
      }
    }
  };

  return (
    <div style={{ marginTop: 20, background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartBox;
