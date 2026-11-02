import { useRef } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import BarChart from "./BarChart";

export default function ResponsiveBarChart({ data, selectedCountry }) {
  const chartRef = useRef();
  const dimensions = useDimensions(chartRef);

  // Get top 10 energy-consuming countries, excluding World
  const top10Data = data
    .filter((d) => d.country !== "World")
    .sort((a, b) => b.primary_energy - a.primary_energy)
    .slice(0, 10);
  console.log("Incoming data:", data.length, data);
  console.log("Final bar chart data:", top10Data.length, top10Data);
  return (
    <div
      ref={chartRef}
      className="w-full h-[500px] bg-white rounded-xl shadow"
      style={{ marginTop: "20px" }}
    >
      <h2
        className="text-xl text-gray-500 font-semibold p-4"
        style={{ padding: "10px 10px 0px 20px" }}
      >
        Top 10 Energy Consumers (2024)
      </h2>
      <p
        className="text-sm text-gray-400"
        style={{
          paddingLeft: "24px",
          paddingTop: "0px",
          fontSize: "12px",
        }}
      >
        Selected Country is highlighted in salmon if it's in the Top 10 Energy
        Consumers.
      </p>
      {dimensions.width > 0 && (
        <BarChart
          width={dimensions.width - 32}
          height={420}
          data={top10Data}
          selectedCountry={selectedCountry}
        />
      )}
    </div>
  );
}
