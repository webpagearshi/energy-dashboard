import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import DonutChart from "./DonutChart";

export default function ResponsiveDonutChart({ data, country }) {
  const chartRef = useRef();
  const dimensions = useDimensions(chartRef);

  return (
    <div ref={chartRef} className="w-full h-[500px] bg-white rounded-xl shadow">
      <h2
        className="text-xl text-gray-500 font-semibold p-4"
        style={{ padding: "10px 10px 0px 20px" }}
      >
        {country} - Energy Distribution 2024
      </h2>

      {dimensions.width > 0 && data && (
        <DonutChart
          width={dimensions.width}
          height={420}
          data={data}
          country={country}
        />
      )}
    </div>
  );
}
