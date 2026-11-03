import * as d3 from "d3";
import { useRef, useState } from "react";
import Tooltip from "./Tooltip";

export default function StackedAreaChart({
  width,
  height,
  data,
  activeCategory,
  onCategoryHover,
  country,
}) {
  const svgRef = useRef(null); // Reference to the SVG element
  const plotRef = useRef(null); // Reference to the plot area (where the areas are drawn)

  const [activeMarker, setActiveMarker] = useState(null); // State to track the active marker for tooltip display

  const margin = {
    top: 20,
    right: 0,
    bottom: 40,
    left: 50,
  };

  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

  // Energy source keys
  const keys = [
    "coal",
    "oil",
    "gas",
    "nuclear",
    "hydro",
    "solar",
    "wind",
    "biofuel",
    "other_renewable",
  ];

  // Color scale
  const colors = d3.scaleOrdinal().domain(keys).range([
    "#746766", // Coal
    "#f73e2d", // Oil
    "#fd8c40", // Gas
    "#a3d0fd", // Nuclear
    "#2173fd", // Hydro
    "#fff0d6", // Solar
    "#e0f1a1", // Wind
    "#85d29e", // Biofuel
    "#01325a", // Other Renewable
  ]);

  // Sort data by year
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  // Stack the data
  const stackedSeries = d3.stack().keys(keys)(sortedData);

  // X Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(sortedData, (d) => d.year))
    .range([0, boundsWidth]);

  // Y Scale
  const maxY = d3.max(stackedSeries, (layer) => d3.max(layer, (d) => d[1]));

  const yScale = d3.scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);

  // Area generator
  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  // Handle mouse movement over the chart
  const handleMouseMove = (event) => {
    // Get cursor coordinates relative to the plotting area
    const [mouseX, mouseY] = d3.pointer(event, plotRef.current);

    // Convert horizontal pixel position into a year
    const xValue = xScale.invert(mouseX);

    // Find the closest year
    const nearestIndex = d3.bisector((d) => d.year).center(sortedData, xValue);

    // Retrieve the complete data record for that year
    const nearestPoint = sortedData[nearestIndex];

    // Convert vertical pixel position into stacked data value
    const yValue = yScale.invert(mouseY);

    // Find which energy source occupies this position
    const hoveredSeries = stackedSeries.find((series) => {
      const segment = series[nearestIndex];

      return yValue >= segment[0] && yValue <= segment[1];
    });

    // No energy source underneath the cursor
    if (!hoveredSeries) {
      onCategoryHover(null);
      setActiveMarker(null);
      return;
    }

    // Get the selected category's stacked boundaries
    const segment = hoveredSeries[nearestIndex];

    // Get cursor coordinates relative to the SVG
    const [svgX, svgY] = d3.pointer(event, svgRef.current);

    // Tooltip dimensions used for positioning
    const tooltipWidth = 190;
    const tooltipHeight = 75;

    // Position tooltip without exceeding chart boundaries
    const xPos = Math.max(8, Math.min(svgX + 14, width - tooltipWidth - 8));

    const yPos = Math.max(8, Math.min(svgY + 14, height - tooltipHeight - 8));

    // Make the category name readable
    const name = hoveredSeries.key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Highlight the active category
    onCategoryHover(hoveredSeries.key);

    // Store tooltip and marker information
    setActiveMarker({
      xPos,
      yPos,
      name,
      country,
      xValue: nearestPoint.year,
      yValue: nearestPoint[hoveredSeries.key],
      color: colors(hoveredSeries.key),
      markerX: xScale(nearestPoint.year),
      markerY: yScale((segment[0] + segment[1]) / 2),
    });
  };

  // Draw the stacked areas
  const areas = stackedSeries.map((series) => {
    const isActive = activeCategory === series.key;

    const opacity = activeCategory === null ? 0.9 : isActive ? 1 : 0.12;

    return (
      <path
        key={series.key}
        d={areaGenerator(series)}
        fill={colors(series.key)}
        opacity={opacity}
        style={{ transition: "opacity 180ms ease" }}
      />
    );
  });

  return (
    <div className="relative" style={{ width, height }}>
      <svg ref={svgRef} width={width} height={height}>
        <g ref={plotRef} transform={`translate(${margin.left}, ${margin.top})`}>
          {areas}

          {/* Invisible interaction layer */}
          <rect
            x={0}
            y={0}
            width={boundsWidth}
            height={boundsHeight}
            fill="transparent"
            pointerEvents="all"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              setActiveMarker(null);
              onCategoryHover(null);
            }}
          />

          {/* Active data point marker */}
          {activeMarker && (
            <circle
              cx={activeMarker.markerX}
              cy={activeMarker.markerY}
              r={5}
              fill="white"
              stroke={activeMarker.color}
              strokeWidth={2}
              pointerEvents="none"
            />
          )}

          {/* X Axis */}
          <g
            transform={`translate(0, ${boundsHeight})`}
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
      <Tooltip interactionData={activeMarker} />
    </div>
  );
}
