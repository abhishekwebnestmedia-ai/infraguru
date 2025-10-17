import React from "react";
import DonutChart from "./apexdonutchart"

export default function PieChartSection() {
  return (
    <div className="bg-white md:p-6 p-2 rounded-2xl flex items-center justify-around w-full h-full">
      <DonutChart
        status2="Not Interested" color2="var(--notInterested)" value2={40} 
        status3="Prospect" color3="var(--Prospect)" value3={5} 
        status4="Total Follow Ups" color4="var(--TotalFollowUps)" value4={54} 
        status5="Closers" color5="var(--Closer)" value5={23} 
      />

    </div>
  );
}
