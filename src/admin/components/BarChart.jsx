import React from "react";
import Chart from "react-apexcharts";

const BarChart = (props) => {
  // 1️⃣ Convert all props to entries ([key, value] pairs)
  const entries = Object.entries(props);

  // 2️⃣ Initialize arrays to hold status names, colors, and values
  const statuss = [];
  const colors = [];
  const values = [];

  // 3️⃣ Loop through props and sort them into the arrays
  entries.forEach(([key, value]) => {
    if (key.startsWith("status") && value) {
      const index = parseInt(key.replace("status", ""));
      statuss[index - 1] = value; // -1 because array is 0-indexed
    }
    if (key.startsWith("color") && value) {
      const index = parseInt(key.replace("color", ""));
      colors[index - 1] = value;
    }

    if (key.startsWith("value") && (value || value === 0)) {
      const index = parseInt(key.replace("value", ""));
      values[index - 1] = value;
    }
  });

  const filteredValues = values.filter((v) => v !== undefined && v !== null);

  // 4️⃣ ApexCharts options for bar chart
  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetY: -20
    },
    colors: colors.filter(Boolean),
    xaxis: {
      categories: statuss.filter(Boolean),
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    grid: {
      show: true,
      borderColor: '#f1f5f9',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function(value) {
          return value + ' leads';
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        plotOptions: {
          bar: {
            columnWidth: '80%'
          }
        }
      }
    }]
  };

  const series = [{
    name: 'Leads',
    data: filteredValues
  }];

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;