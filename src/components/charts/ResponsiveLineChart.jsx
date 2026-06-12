import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import LineChart from "./LineChart";

export default function ResponsiveLineChart({ data, selectedCountry }) {
  const chartRef = useRef();

  const dimensions = useDimensions(chartRef);

  return (
    <div
      ref={chartRef}
      className="w-full h-[500px] bg-white rounded-xl shadow"
      style={{ marginTop: "20px" }}
    >
      <h2
        className="text-xl text-gray-500 font-semibold"
        style={{
          paddingLeft: "24px",
          paddingTop: "16px",
        }}
      >
        Primary Energy Consumption Over Time - {selectedCountry}
      </h2>
      <p
        className="text-sm text-gray-400"
        style={{
          paddingLeft: "24px",
          paddingTop: "0px",
          fontSize: "10px",
        }}
      >
        Selected Country is highlighted in blue. | World average is shown as a
        dashed line.
      </p>
      {dimensions.width > 0 && (
        <LineChart
          width={dimensions.width}
          height={450}
          data={data}
          selectedCountry={selectedCountry}
        />
      )}
    </div>
  );
}
