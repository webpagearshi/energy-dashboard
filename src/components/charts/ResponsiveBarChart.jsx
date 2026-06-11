import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import BarChart from "./BarChart";

export default function ResponsiveBarChart({ data, selectedCountry }) {
  const chartRef = useRef();
  const dimensions = useDimensions(chartRef);

  return (
    <div ref={chartRef} className="w-full h-[500px] bg-white rounded-xl shadow">
      <h2 className="text-xl text-gray-500 font-semibold p-4">
        Top 10 Energy Consumers (2024)
      </h2>

      {dimensions.width > 0 && (
        <BarChart
          width={dimensions.width - 32}
          height={420}
          data={data}
          selectedCountry={selectedCountry}
        />
      )}
    </div>
  );
}
