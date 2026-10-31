import * as d3 from "d3";

export default function StackedAreaChart({
  width,
  height,
  data,
  activeCategory,
  onCategoryHover,
}) {
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

  // Stack the data
  const stackedSeries = d3.stack().keys(keys)(data);

  // X Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
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
        onMouseEnter={() => onCategoryHover(series.key)}
        onMouseLeave={() => onCategoryHover(null)}
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {areas}

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
  );
}
