import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import StackedAreaChart from "./StackedAreaChart";

export default function ResponsiveStackedAreaChart({ data }) {
  const chartRef = useRef();

  const dimensions = useDimensions(chartRef);

  return (
    <div ref={chartRef} className="w-full h-[500px] bg-white rounded-xl shadow">
      <h2
        className="text-xl mb-4 m-4 text-gray-500 font-semibold"
        style={{ padding: "10px 10px 0px 20px" }}
      >
        Energy Consumption by Source
      </h2>
      {dimensions.width > 0 && (
        <StackedAreaChart
          width={dimensions.width - 32}
          height={450}
          data={data}
        />
      )}
    </div>
  );
}
