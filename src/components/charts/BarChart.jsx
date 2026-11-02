import * as d3 from "d3";
import { useState } from "react";

export default function BarChart({ width, height, data, selectedCountry }) {
  const [hoveredCountry, setHoveredCountry] = useState(null); // State to track the hovered country for highlighting

  const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 100,
  };

  const boundsWidth = width - margin.left - margin.right;

  const boundsHeight = height - margin.top - margin.bottom;

  // Exclude World from the bar chart
  const chartData = data.filter((d) => d.country !== "World");

  //y scale
  const yScale = d3
    .scaleBand()
    .domain(chartData.map((d) => d.country))
    .range([0, boundsHeight])
    .padding(0.2);
  //x scale
  const maxValue = d3.max(chartData, (d) => d.primary_energy);

  const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, boundsWidth]);

  const bars = chartData.map((d) => {
    const barWidth = xScale(d.primary_energy);

    const isHovered = hoveredCountry === d.country;

    return (
      <g
        key={d.country}
        onPointerEnter={() => setHoveredCountry(d.country)}
        onPointerLeave={() => setHoveredCountry(null)}
      >
        {/* Bar */}
        <rect
          x={0}
          y={yScale(d.country)}
          width={barWidth}
          height={yScale.bandwidth()}
          fill={d.country === selectedCountry ? "salmon" : "#2173fd"}
          rx={4}
        />

        {/* Energy value on hover */}
        {isHovered && (
          <text
            x={barWidth > 90 ? barWidth - 8 : barWidth + 8}
            y={yScale(d.country) + yScale.bandwidth() / 2}
            textAnchor={barWidth > 90 ? "end" : "start"}
            dominantBaseline="middle"
            fontSize={11}
            fontWeight="600"
            fill={barWidth > 90 ? "white" : "#4b5563"}
            pointerEvents="none"
          >
            {d3.format(",.1f")(d.primary_energy)} TWh
          </text>
        )}
      </g>
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(
        ${margin.left},
        ${margin.top}
      )`}
      >
        {bars}

        <g
          ref={(node) => {
            if (node) {
              d3.select(node).call(d3.axisLeft(yScale));
            }
          }}
        />

        <g
          transform={`translate(
          0,
          ${boundsHeight}
        )`}
          ref={(node) => {
            if (node) {
              d3.select(node).call(d3.axisBottom(xScale));
            }
          }}
        />
      </g>
    </svg>
  );
}
