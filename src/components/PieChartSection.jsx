import React from "react";
import DonutChart from "./apexdonutchart"

export default function PieChartSection() {


  return (
    <div className="bg-white p-6 rounded-2xl flex items-center justify-around w-full h-full">
<DonutChart
  status1="A" status2="B" status3="C" status4="D" status5="E"
  status6="F" status7="G" status8="H" status9="I" status10="J"
  color1="#008FFB" color2="#00E396" color3="#FEB019" color4="#FF4560" color5="#775DD0"
  color6="#546E7A" color7="#26A69A" color8="#D10CE8" color9="#7C4DFF" color10="#FF6F00"
  value1={10} value2={20} value3={15} value4={25} value5={30}
  value6={5} value7={12} value8={18} value9={8} value10={22}
/>


    </div>
  );
}
