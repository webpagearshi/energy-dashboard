import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import Tooltip from "./Tooltip";

export default function StackedAreaChart({
  width,
  height,
  data,
  activeCategory,
  onCategoryHover,
  country,
}) {
  const svgRef = useRef(null);
  const plotRef = useRef(null);
  const pathRefs = useRef({});
  const previousDataRef = useRef(null);
  const previousCountryRef = useRef(null);

  const [activeMarker, setActiveMarker] = useState(null);

  const margin = {
    top: 20,
    right: 0,
    bottom: 40,
    left: 50,
  };

  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

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

  const colors = d3
    .scaleOrdinal()
    .domain(keys)
    .range([
      "#746766",
      "#f73e2d",
      "#fd8c40",
      "#a3d0fd",
      "#2173fd",
      "#fff0d6",
      "#e0f1a1",
      "#85d29e",
      "#01325a",
    ]);

  const sortedData = [...data].sort((a, b) => a.year - b.year);

  const stackedSeries = d3.stack().keys(keys)(sortedData);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(sortedData, (d) => d.year))
    .range([0, boundsWidth]);

  const maxY = d3.max(stackedSeries, (layer) => d3.max(layer, (d) => d[1]));

  const yScale = d3.scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);

  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  /*
   * Animate the stacked areas when the country changes.
   * Interpolate the actual stacked values rather than
   * morphing the old path using the new country's scale.
   */
  useEffect(() => {
    const previousData = previousDataRef.current;
    const previousCountry = previousCountryRef.current;

    const countryChanged =
      previousCountry !== null && previousCountry !== country;

    if (countryChanged && previousData) {
      const previousSortedData = [...previousData].sort(
        (a, b) => a.year - b.year,
      );

      const previousStackedSeries = d3.stack().keys(keys)(previousSortedData);

      const currentStackedSeries = d3.stack().keys(keys)(sortedData);

      const previousSeriesMap = new Map(
        previousStackedSeries.map((series) => [series.key, series]),
      );

      const currentSeriesMap = new Map(
        currentStackedSeries.map((series) => [series.key, series]),
      );

      keys.forEach((key) => {
        const path = pathRefs.current[key];

        const previousSeries = previousSeriesMap.get(key);
        const currentSeries = currentSeriesMap.get(key);

        if (!path || !previousSeries || !currentSeries) {
          return;
        }

        const previousByYear = new Map(
          previousSeries.map((point) => [point.data.year, point]),
        );

        const interpolators = currentSeries.map((currentPoint) => {
          const previousPoint = previousByYear.get(currentPoint.data.year);

          if (!previousPoint) {
            return d3.interpolate([0, 0], [currentPoint[0], currentPoint[1]]);
          }

          return d3.interpolate(
            [previousPoint[0], previousPoint[1]],
            [currentPoint[0], currentPoint[1]],
          );
        });

        d3.select(path)
          .interrupt()
          .transition()
          .duration(700)
          .ease(d3.easeCubicInOut)
          .attrTween("d", () => {
            return (t) => {
              const interpolatedSeries = currentSeries.map((point, index) => {
                const values = interpolators[index](t);

                return {
                  ...point,
                  0: values[0],
                  1: values[1],
                };
              });

              return areaGenerator(interpolatedSeries);
            };
          });
      });
    }

    previousDataRef.current = sortedData;
    previousCountryRef.current = country;
  }, [country, data, width, height]);

  // Clear the tooltip marker when the country changes.
  useEffect(() => {
    setActiveMarker(null);
  }, [country]);

  const handleMouseMove = (event) => {
    const [mouseX, mouseY] = d3.pointer(event, plotRef.current);

    const xValue = xScale.invert(mouseX);

    const nearestIndex = d3.bisector((d) => d.year).center(sortedData, xValue);

    const nearestPoint = sortedData[nearestIndex];
    const yValue = yScale.invert(mouseY);

    const hoveredSeries = stackedSeries.find((series) => {
      const segment = series[nearestIndex];

      return yValue >= segment[0] && yValue <= segment[1];
    });

    if (!hoveredSeries) {
      onCategoryHover(null);
      setActiveMarker(null);
      return;
    }

    const segment = hoveredSeries[nearestIndex];

    const [svgX, svgY] = d3.pointer(event, svgRef.current);

    const tooltipWidth = 190;
    const tooltipHeight = 75;

    const xPos = Math.max(8, Math.min(svgX + 14, width - tooltipWidth - 8));

    const yPos = Math.max(8, Math.min(svgY + 14, height - tooltipHeight - 8));

    const name = hoveredSeries.key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    onCategoryHover(hoveredSeries.key);

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

  const areas = stackedSeries.map((series) => {
    const isActive = activeCategory === series.key;

    const opacity = activeCategory === null ? 0.9 : isActive ? 1 : 0.12;

    return (
      <path
        key={series.key}
        ref={(node) => {
          pathRefs.current[series.key] = node;
        }}
        className="energy-area"
        d={areaGenerator(series)}
        fill={colors(series.key)}
        opacity={opacity}
        style={{
          transition: "opacity 180ms ease",
        }}
      />
    );
  });

  return (
    <div className="relative" style={{ width, height }}>
      <svg ref={svgRef} width={width} height={height}>
        <g ref={plotRef} transform={`translate(${margin.left}, ${margin.top})`}>
          {areas}

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
