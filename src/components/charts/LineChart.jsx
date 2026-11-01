import * as d3 from "d3";
import { useState } from "react";

export default function LineChart({
  width,
  height,
  data,
  selectedCountry,
  comparisonCountry,
}) {
  const [isChartHovered, setIsChartHovered] = useState(false); // State to track if the chart is hovered

  const margin = {
    top: 20,
    right: 30,
    bottom: 50,
    left: 60,
  };

  const boundsWidth = width - margin.left - margin.right;

  const boundsHeight = height - margin.top - margin.bottom;

  // Group data by country
  const countries = d3.group(data, (d) => d.country);

  // Primary country data
  const selectedData = countries.get(selectedCountry);

  // Comparison country data
  const comparisonData = comparisonCountry
    ? countries.get(comparisonCountry)
    : undefined;

  // X Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);

  // Y Scale

  // Maximum value across the entire dataset
  const maxEnergy = d3.max(data, (d) => d.primary_energy);

  // Combine the selected countries' data
  const focusedData = [...(selectedData || []), ...(comparisonData || [])];

  // Find the minimum and maximum values
  const focusExtent = d3.extent(focusedData, (d) => d.primary_energy);

  // Choose the Y-axis domain
  const yDomain =
    isChartHovered && focusedData.length > 0 ? focusExtent : [0, maxEnergy];

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .nice()
    .range([boundsHeight, 0]);

  // Line Generator
  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.primary_energy))
    .curve(d3.curveMonotoneX);

  // ---------------------------
  // Other Countries (Gray)
  // ---------------------------

  const otherLines = [...countries.entries()]
    .filter(
      ([country]) =>
        country !== selectedCountry &&
        country !== comparisonCountry &&
        country !== "World",
    )
    .map(([country, values]) => (
      <path
        key={country}
        d={lineGenerator(values)}
        fill="none"
        stroke="#d1d5db"
        strokeWidth={1}
        opacity={0.6}
      />
    ));

  // ---------------------------
  // World Line
  // ---------------------------

  const worldData = countries.get("World");

  const worldLine = worldData && (
    <path
      d={lineGenerator(worldData)}
      fill="none"
      stroke="#2563eb"
      strokeWidth={1.5}
      strokeDasharray="6 4"
    />
  );

  // ---------------------------
  // Selected Country Line
  // ---------------------------

  const comparisonLine = comparisonData && (
    <path
      d={lineGenerator(comparisonData)}
      fill="none"
      stroke="#8b5cf6"
      strokeWidth={2}
      strokeDasharray="3 3"
    />
  );

  const selectedLine = selectedData && (
    <path
      d={lineGenerator(selectedData)}
      fill="none"
      stroke="#1d4ed8"
      strokeWidth={2}
    />
  );

  return (
    <svg
      width={width}
      height={height}
      onPointerEnter={() => setIsChartHovered(true)}
      onPointerLeave={() => setIsChartHovered(false)}
    >
      <g
        transform={`translate(
          ${margin.left},
          ${margin.top}
        )`}
      >
        {/* All Other Countries */}
        {!isChartHovered && otherLines}

        {/* World */}
        {!isChartHovered && worldLine}

        {/* Comparison Country */}
        {comparisonLine}

        {/* Selected Country */}
        {selectedLine}

        {/* X Axis */}
        <g
          transform={`translate(
            0,
            ${boundsHeight}
          )`}
          ref={(node) => {
            if (node) {
              d3.select(node).call(
                d3.axisBottom(xScale).tickFormat(d3.format("d")),
              );
            }
          }}
        />

        {/* Y Axis */}
        <g
          ref={(node) => {
            if (node) {
              d3.select(node).call(d3.axisLeft(yScale));
            }
          }}
        />
      </g>
    </svg>
  );
}
