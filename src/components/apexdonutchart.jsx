import React from "react";
import Chart from "react-apexcharts";

const DonutChart = (props) => {
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

  // 4️⃣ ApexCharts options
  const options = {
    chart: {
      type: "donut",
    },
    labels: statuss.filter(Boolean),
    colors: colors.filter(Boolean),
    plotOptions: {
      pie: {
        donut: {
          size: "90%", // Adjust thickness
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total", // Text to display above total value
              fontSize: "18px",
              fontWeight: 600,
              color: "#373d3f",
              formatter: () => filteredValues.reduce((a, b) => a + b, 0), // Sum of all series
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false, // Hide numbers on slices
    },
    legend: {
      position: "right",
      formatter: function (seriesName, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName} — ${value}`;
      },
    },
    responsive: [
      {
        breakpoint: 768, // Tablets and larger mobile screens
        options: {
          chart: { width: 320 },
          legend: { position: "bottom" },
        },
      },
      {
        breakpoint: 480, // Small mobile screens - increased from 200 to 280
        options: {
          chart: { width: 280 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="w-full flex justify-center">
      <Chart options={options} series={filteredValues} type="donut" width="380" />
    </div>
  );
};

export default DonutChart;
