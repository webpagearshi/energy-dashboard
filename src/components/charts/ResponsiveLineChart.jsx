import { useRef, useEffect, useState } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import LineChart from "./LineChart";

export default function ResponsiveLineChart({ data, selectedCountry }) {
  const chartRef = useRef();

  const dimensions = useDimensions(chartRef);
  const [comparisonCountry, setComparisonCountry] = useState("");

  const comparisonOptions = [...new Set(data.map((d) => d.country))]
    .filter((country) => country !== "World" && country !== selectedCountry)
    .sort(); // Sort the options alphabetically

  useEffect(() => {
    if (comparisonCountry === selectedCountry) {
      setComparisonCountry("");
    }
  }, [selectedCountry, comparisonCountry]); // Reset comparison country if it matches the selected country

  return (
    // OUTER CONTAINER — KEEP THIS
    <div
      ref={chartRef}
      className="w-full h-[500px] bg-white rounded-xl shadow"
      style={{ marginTop: "20px" }}
    >
      {/* HEADER: Title + Comparison Selector */}
      <div className="flex justify-between items-start px-6 pt-4 gap-4">
        {/* LEFT: Chart title and description */}
        <div>
          <h2
            className="text-xl text-gray-500 font-semibold"
            style={{ marginLeft: "10px" }}
          >
            Primary Energy Consumption Over Time - {selectedCountry}
          </h2>

          <p
            className="text-sm text-gray-400 mt-1"
            style={{ fontSize: "10px", marginLeft: "10px" }}
          ></p>
        </div>

        {/* RIGHT: Comparison country selector */}
        <div className="flex flex-col w-[150px] mr-[10px]">
          <label
            htmlFor="comparison-country"
            className="text-xs text-gray-500 mb-1"
          >
            Compare with
          </label>

          <select
            id="comparison-country"
            value={comparisonCountry}
            onChange={(e) => setComparisonCountry(e.target.value)}
            className="w-full border rounded-lg px-2 py-2 text-xs text-gray-600"
            style={{ fontSize: "15px" }}
          >
            <option value="">No comparison</option>

            {comparisonOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CHART */}
      {dimensions.width > 0 && (
        <LineChart
          width={dimensions.width}
          height={450}
          data={data}
          selectedCountry={selectedCountry}
          comparisonCountry={comparisonCountry}
        />
      )}
    </div>
  );
}
