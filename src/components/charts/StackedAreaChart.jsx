import * as d3 from "d3";

export default function StackedAreaChart({ width, height, data }) {
  const margin = {
    top: 20,
    right: 0,
    bottom: 70,
    left: 50,
  };
  // The width of the area where the chart will be drawn, excluding margins
  const boundsWidth = width - margin.left - margin.right;
  // The height of the area where the chart will be drawn, excluding margins
  const boundsHeight = height - margin.top - margin.bottom;
  // Define the keys for the different energy sources
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

  // Define labels for the energy sources (optional, can be used for tooltips or legends)
  const labels = {
    coal: "Coal",
    oil: "Oil",
    gas: "Gas",
    nuclear: "Nuclear",
    hydro: "Hydro",
    solar: "Solar",
    wind: "Wind",
    biofuel: "Biofuel",
    other_renewable: "Other Renewable",
  };

  // Define a color scale for the different energy sources
  const colors = d3.scaleOrdinal().domain(keys).range([
    "#746766", // coal
    "#f73e2d", // oil
    "#fd8c40", // gas
    "#a3d0fd", // nuclear
    "#2173fd", // hydro
    "#fff0d6", // solar
    "#e0f1a1", // wind
    "#85d29e", // biofuel
    "#01325a", // other renewable
  ]);

  // Use D3's stack function to transform the data into a format suitable for a stacked area chart
  const stackedSeries = d3.stack().keys(keys)(data);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);

  // Calculate the maximum y-value across all layers of the stacked series to set the y-axis domain
  const maxY = d3.max(stackedSeries, (layer) => d3.max(layer, (d) => d[1]));
  const yScale = d3.scaleLinear().domain([0, maxY]).range([boundsHeight, 0]);

  // Define an area generator function that will create the SVG path data for each layer of the stacked area chart
  const areaGenerator = d3
    .area()
    .x((d) => xScale(d.data.year))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  //create areas
  const areas = stackedSeries.map((series) => (
    <path
      key={series.key}
      d={areaGenerator(series)}
      fill={colors(series.key)}
      opacity={0.9}
    />
  ));
  // Create legend items
  const legendSpacing = boundsWidth / keys.length;

  const itemWidth = 80;
  const legendWidth = itemWidth * keys.length;
  const legendStartX = (boundsWidth - legendWidth) / 2;

  const legendItems = keys.map((key, i) => (
    <g key={key} transform={`translate(${legendStartX + i * itemWidth}, 0)`}>
      <rect width="12" height="12" fill={colors(key)} rx="2" />

      <text x="18" y="10" fontSize="10" fill="#374151">
        {labels[key]}
      </text>
    </g>
  ));

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {areas}

        {/* X Axis */}
        <g
          transform={`translate(0,${boundsHeight})`}
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
      <g
        transform={`translate(
    0,
    ${boundsHeight + 50}
  )`}
      >
        {legendItems}
      </g>
    </svg>
  );
}
