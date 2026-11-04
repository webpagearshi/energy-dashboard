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
  const [hoveredYear, setHoveredYear] = useState(null); // State to track the year being hovered over
  const margin = {
    top: 30,
    right: 10,
    bottom: 20,
    left: 70,
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

  // Sort selected country data by year
  const selectedDataSorted = [...(selectedData || [])].sort(
    (a, b) => a.year - b.year,
  );

  // Find primary country value for hovered year
  const selectedPoint =
    hoveredYear !== null
      ? selectedDataSorted.find((d) => d.year === hoveredYear)
      : null;

  // Find comparison country value for hovered year
  const comparisonPoint =
    hoveredYear !== null && comparisonData
      ? comparisonData.find((d) => d.year === hoveredYear)
      : null;

  // Format energy values
  const formatValue = d3.format(",.2f");

  // Calculate difference between the two countries
  const difference =
    selectedPoint && comparisonPoint
      ? selectedPoint.primary_energy - comparisonPoint.primary_energy
      : null;

  // X Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);

  // Handle mouse movement
  const handlePointerMove = (event) => {
    if (selectedDataSorted.length === 0) return;

    // Get mouse coordinates relative to the chart
    const [mouseX] = d3.pointer(event, event.currentTarget);

    // Convert mouse position into a year
    const targetYear = xScale.invert(mouseX);

    // Find the nearest available year
    const nearestIndex = d3
      .bisector((d) => d.year)
      .center(selectedDataSorted, targetYear);

    // Get the actual year
    const nearestYear = selectedDataSorted[nearestIndex].year;

    // Update React state
    setHoveredYear(nearestYear);
  };

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

  // Tooltip dimensions
  const tooltipWidth = 220;
  const tooltipHeight = 102;

  // Tooltip horizontal position
  const tooltipX =
    hoveredYear === null
      ? 0
      : xScale(hoveredYear) + tooltipWidth + 16 <= boundsWidth
        ? xScale(hoveredYear) + 16
        : Math.max(4, xScale(hoveredYear) - tooltipWidth - 16);

  // Tooltip vertical position
  const tooltipY = 8;

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
        <rect
          x={0}
          y={0}
          width={boundsWidth}
          height={boundsHeight}
          fill="transparent"
          pointerEvents="all"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredYear(null)}
        />
        {/* All Other Countries */}
        {!isChartHovered && otherLines}

        {/* World */}
        {!isChartHovered && worldLine}

        {/* Comparison Country */}
        {comparisonLine}

        {/* Selected Country */}
        {selectedLine}

        {/* Vertical guide line */}
        {hoveredYear !== null && (
          <line
            x1={xScale(hoveredYear)}
            x2={xScale(hoveredYear)}
            y1={0}
            y2={boundsHeight}
            stroke="#9ca3af"
            strokeWidth={1}
            strokeDasharray="4 4"
            pointerEvents="none"
          />
        )}

        {/* Primary country marker */}
        {selectedPoint && (
          <g pointerEvents="none">
            {/* Red outer circle */}
            <circle
              cx={xScale(selectedPoint.year)}
              cy={yScale(selectedPoint.primary_energy)}
              r={7}
              fill="white"
              stroke="#ef4444"
              strokeWidth={2}
            />

            {/* Inner circle */}
            <circle
              cx={xScale(selectedPoint.year)}
              cy={yScale(selectedPoint.primary_energy)}
              r={3}
              fill="#1d4ed8"
            />
          </g>
        )}

        {/* Comparison country marker */}
        {comparisonPoint && (
          <g pointerEvents="none">
            {/* Red outer circle */}
            <circle
              cx={xScale(comparisonPoint.year)}
              cy={yScale(comparisonPoint.primary_energy)}
              r={7}
              fill="white"
              stroke="#ef4444"
              strokeWidth={2}
            />

            {/* Inner circle */}
            <circle
              cx={xScale(comparisonPoint.year)}
              cy={yScale(comparisonPoint.primary_energy)}
              r={3}
              fill="#8b5cf6"
            />
          </g>
        )}
        {/* Comparative Tooltip */}
        {hoveredYear !== null && selectedPoint && (
          <g
            transform={`translate(${tooltipX}, ${tooltipY})`}
            pointerEvents="none"
          >
            {/* Tooltip Background */}
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx={8}
              fill="white"
              stroke="#e5e7eb"
              strokeWidth={1}
              style={{
                filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.12))",
              }}
            />

            {/* Tooltip Heading */}
            <text x={12} y={20} fontSize={11} fontWeight="600" fill="#374151">
              Energy Consumption · {hoveredYear}
            </text>

            {/* Divider */}
            <line
              x1={10}
              y1={29}
              x2={tooltipWidth - 10}
              y2={29}
              stroke="#e5e7eb"
            />

            {/* Primary Country */}
            <circle cx={14} cy={46} r={4} fill="#1d4ed8" />

            <text x={24} y={49} fontSize={10} fill="#4b5563">
              {selectedCountry}
            </text>

            <text
              x={tooltipWidth - 12}
              y={49}
              textAnchor="end"
              fontSize={10}
              fontWeight="600"
              fill="#374151"
            >
              {formatValue(selectedPoint.primary_energy)}
            </text>

            {/* Comparison Country */}
            {comparisonCountry && (
              <>
                <circle cx={14} cy={66} r={4} fill="#8b5cf6" />

                <text x={24} y={69} fontSize={10} fill="#4b5563">
                  {comparisonCountry}
                </text>

                <text
                  x={tooltipWidth - 12}
                  y={69}
                  textAnchor="end"
                  fontSize={10}
                  fontWeight="600"
                  fill="#374151"
                >
                  {comparisonPoint
                    ? formatValue(comparisonPoint.primary_energy)
                    : "No data"}
                </text>
              </>
            )}

            {/* Difference */}
            {comparisonPoint && (
              <>
                <line
                  x1={10}
                  y1={78}
                  x2={tooltipWidth - 10}
                  y2={78}
                  stroke="#e5e7eb"
                />

                <text x={12} y={93} fontSize={10} fill="#6b7280">
                  Difference
                </text>

                <text
                  x={tooltipWidth - 12}
                  y={93}
                  textAnchor="end"
                  fontSize={10}
                  fontWeight="600"
                  fill="#374151"
                >
                  {d3.format("+,.2f")(difference)}
                </text>
              </>
            )}
          </g>
        )}

        {hoveredYear !== null && (
          <text
            x={xScale(hoveredYear)}
            y={-6}
            textAnchor="middle"
            fontSize="11"
            fill="#4b5563"
          >
            {hoveredYear}
          </text>
        )}

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
