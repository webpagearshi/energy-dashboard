import { useRef, useState } from "react";
import { useDimensions } from "../../hooks/useDimensions";
import StackedAreaChart from "./StackedAreaChart";

// Static legend configuration
const legendItems = [
  { key: "coal", label: "Coal", color: "#746766" },
  { key: "oil", label: "Oil", color: "#f73e2d" },
  { key: "gas", label: "Gas", color: "#fd8c40" },
  { key: "nuclear", label: "Nuclear", color: "#a3d0fd" },
  { key: "hydro", label: "Hydro", color: "#2173fd" },
  { key: "solar", label: "Solar", color: "#fff0d6" },
  { key: "wind", label: "Wind", color: "#e0f1a1" },
  { key: "biofuel", label: "Biofuel", color: "#85d29e" },
  { key: "other_renewable", label: "Other Renewable", color: "#01325a" },
];

export default function ResponsiveStackedAreaChart({ data, country }) {
  const chartRef = useRef();
  const dimensions = useDimensions(chartRef);
  const [activeCategory, setActiveCategory] = useState(null); // State to track the active category for highlighting

  return (
    <div ref={chartRef} className="w-full bg-white rounded-xl shadow">
      {/* Title */}
      <div
        style={{
          paddingLeft: "20px",
          paddingTop: "10px",
          paddingBottom: "0px",
        }}
      >
        <h2 className="text-xl font-semibold text-gray-500">
          Energy Consumption by Source - {country}
        </h2>
      </div>

      {/* Chart */}
      <div className="px-6">
        {dimensions.width > 0 && (
          <StackedAreaChart
            width={dimensions.width - 32}
            height={440}
            data={data}
            activeCategory={activeCategory}
            onCategoryHover={setActiveCategory}
            country={country}
          />
        )}
      </div>

      {/* Legend */}
      <div className="px-6 pb-6 pt-3">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {legendItems.map((item) => (
            <div
              style={{
                paddingBottom: "10px",
                opacity:
                  activeCategory === null || activeCategory === item.key
                    ? 1.0
                    : 0.35,
                transition: "opacity 180ms ease",
                cursor: "pointer",
              }}
              key={item.key}
              className="flex items-center gap-2 text-xs text-gray-700"
              onMouseEnter={() => setActiveCategory(item.key)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
