import * as d3 from "d3";

export default function LineChart({ width, height, data, selectedCountry }) {
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

  // X Scale
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, boundsWidth]);

  // Y Scale
  const maxEnergy = d3.max(data, (d) => d.primary_energy);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxEnergy])
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
    .filter(([country]) => country !== selectedCountry && country !== "World")
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

  const selectedData = countries.get(selectedCountry);

  const selectedLine = selectedData && (
    <path
      d={lineGenerator(selectedData)}
      fill="none"
      stroke="#1d4ed8"
      strokeWidth={2}
    />
  );

  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(
          ${margin.left},
          ${margin.top}
        )`}
      >
        {/* All Other Countries */}
        {otherLines}

        {/* World */}
        {worldLine}

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
