import * as d3 from "d3";

export default function BarChart({ width, height, data, selectedCountry }) {
  const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 100,
  };

  const boundsWidth = width - margin.left - margin.right;

  const boundsHeight = height - margin.top - margin.bottom;
  //y scale
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.country))
    .range([0, boundsHeight])
    .padding(0.2);
  //x scale
  const maxValue = d3.max(data, (d) => d.primary_energy);

  const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, boundsWidth]);
  const bars = data.map((d) => (
    // Render a rectangle for each country, with width based on primary energy and height based on the yScale
    <rect
      key={d.country}
      x={0}
      y={yScale(d.country)}
      width={xScale(d.primary_energy)}
      height={yScale.bandwidth()}
      fill={d.country === selectedCountry ? "#f97316" : "#2173fd"}
      rx={4}
    />
  ));
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
