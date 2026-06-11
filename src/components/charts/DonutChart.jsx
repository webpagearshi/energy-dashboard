import * as d3 from "d3";

export default function DonutChart({ width, height, data, country }) {
  // Transform the data into a format suitable for the pie generator, remove zero-value categories
  const energyMix = [
    { name: "Coal", value: data.coal },
    { name: "Oil", value: data.oil },
    { name: "Gas", value: data.gas },
    { name: "Nuclear", value: data.nuclear },
    { name: "Hydro", value: data.hydro },
    { name: "Solar", value: data.solar },
    { name: "Wind", value: data.wind },
    { name: "Biofuel", value: data.biofuel },
    { name: "Other Renewable", value: data.other_renewable },
  ].filter((d) => d.value > 0);

  // Set up color scale and pie generator
  const colors = d3
    .scaleOrdinal()
    .domain(energyMix.map((d) => d.name))
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
  const pieGenerator = d3
    .pie()
    .value((d) => d.value)
    .sort(null);
  // Generate the pie data and arc generator
  const pieData = pieGenerator(energyMix);
  // Calculate the radius based on the smaller dimension of the chart
  const radius = Math.min(width, height) / 2 - 30;
  // Create the arc generator for the donut slices
  const arcGenerator = d3
    .arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius);
  // Generate the SVG paths for each slice of the donut chart
  const slices = pieData.map((slice, i) => (
    <path
      key={i}
      d={arcGenerator(slice)}
      fill={colors(slice.data.name)}
      stroke="white"
      strokeWidth={2}
    />
  ));
  // Render the SVG with the donut chart and center text
  return (
    <svg width={width} height={height}>
      <g
        transform={`translate(
        ${width / 2},
        ${height / 2}
      )`}
      >
        {slices}

        <text textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">
          {country}
        </text>
        <text y="22" textAnchor="middle" fontSize="12" fill="#6B7280">
          {data.primary_energy?.toFixed(0)} TWh
        </text>

        <text y="40" textAnchor="middle" fontSize="10" fill="#6B7280">
          2024
        </text>
      </g>
    </svg>
  );
}
