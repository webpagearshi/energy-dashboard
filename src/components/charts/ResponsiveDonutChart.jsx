import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import DonutChart from "./DonutChart";

export default function ResponsiveDonutChart({ country }) {
  const chartRef = useRef();

  const dimensions = useDimensions(chartRef);

  return (
    <div ref={chartRef} className="w-full h-[500px] bg-white rounded-xl shadow">
      <h2
        className="text-xl mb-4 text-gray-500 font-semibold"
        style={{ paddingLeft: "24px", paddingTop: "16px" }}
      >
        2024 Energy Mix
      </h2>

      {dimensions.width > 0 && (
        <DonutChart width={dimensions.width} height={420} country={country} />
      )}
    </div>
  );
}
