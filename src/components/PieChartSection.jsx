import React from "react";
import ReactApexChart from "react-apexcharts";

export default function PieChartSection() {
  const chartOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false, // Custom legend displayed manually
    },
    tooltip: {
      enabled: false,
    },
    colors: [
      "#61D6EA", // Site Visit - cyan
      "#FF66C4", // Calling buyer - cyan (same as site visit)
      "#AF4C0F", // Sale inventory - brown
      "#FF3131", // Hot leads - red
      "#FAEE20", // Dead leads - yellow
      "#FFBD59", // Rent inventory - orange
      "#5170FF", // Calling seller - blue
    ],
    fill: {
      type: "solid", // Remove gradient, use solid colors only
    },
    plotOptions: {
      pie: {
        donut: {
          size: "90%",
          labels: {
            show: false,
          },
        },
      },
    },
    stroke: {
      width: 0,
      colors: ["transparent"],
        lineCap: 'round',
    },
  };

  // Updated series data for 7 segments
  const series = [4, 4, 6, 6, 6, 6, 6]; // 7 values for 7 segments

  const legendItems = [
    { color: "#61D6EA", label: "Site Visit", value: 4 },
    { color: "#FF66C4", label: "No. of Calls", value: 4 }, 
    { color: "#AF4C0F", label: "Sale inventory", value: 6 },
    { color: "#FF3131", label: "Hot leads", value: 6 },
    { color: "#FAEE20", label: "Dead leads", value: 6 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl flex items-center justify-around w-full h-full">
      {/* Apex Donut Chart */}
      <div className="relative w-48 h-48">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="donut"
          height={190}
          width={190}
        />
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-[#7ED321]">29</span>
          <span className="text-gray-600 text-base font-medium">Overall</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-1 gap-3 ml-8">
        {legendItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between w-full gap-12"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span
                className="text-gray-800 text-sm font-medium text-nowrap min-w-[120px]"
                title={item.label}
              >
                {item.label}
              </span>
            </div>
            <span className="text-gray-800 text-lg font-semibold flex-shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
