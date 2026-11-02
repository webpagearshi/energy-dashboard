import * as d3 from "d3";
import { useState } from "react";

export default function DonutChart({ width, height, data, country }) {
  const [activeCategory, setActiveCategory] = useState(null); // State to track the active category for highlighting

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

  // Expanded arc for the hovered slice
  const activeArcGenerator = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius + 6);

  // Generate the SVG paths for each slice
  const slices = pieData.map((slice) => {
    const isActive = activeCategory === slice.data.name;

    // Find the direction in which the slice should move
    const [centroidX, centroidY] = arcGenerator.centroid(slice);

    const centroidLength = Math.hypot(centroidX, centroidY) || 1;

    // Move the active slice 7 pixels away from the centre
    const offset = isActive ? 7 : 0;

    const moveX = (centroidX / centroidLength) * offset;
    const moveY = (centroidY / centroidLength) * offset;

    return (
      <g
        key={slice.data.name}
        transform={`translate(${moveX}, ${moveY})`}
        style={{
          cursor: "pointer",
        }}
      >
        <path
          d={isActive ? activeArcGenerator(slice) : arcGenerator(slice)}
          fill={colors(slice.data.name)}
          stroke={isActive ? "black" : "white"}
          strokeWidth={isActive ? 0.5 : 2}
          opacity={activeCategory === null || isActive ? 1 : 0.25}
          style={{
            transition: "opacity 180ms ease",
          }}
        />
      </g>
    );
  });
  // Invisible hover areas for detecting slices
  const sliceHitAreas = pieData.map((slice) => (
    <path
      key={`hit-${slice.data.name}`}
      d={arcGenerator(slice)}
      fill="transparent"
      pointerEvents="all"
      onPointerEnter={() => setActiveCategory(slice.data.name)}
      onPointerLeave={() => setActiveCategory(null)}
    />
  ));

  // Find the currently selected slice
  const activeSlice = pieData.find(
    (slice) => slice.data.name === activeCategory,
  );

  // Calculate total energy represented in the donut
  const totalEnergy = d3.sum(energyMix, (d) => d.value);

  // Calculate selected category's percentage
  const activeShare = activeSlice
    ? (activeSlice.data.value / totalEnergy) * 100
    : 0;

  const formatValue = d3.format(",.1f"); // Format values with one decimal place and commas

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
        {sliceHitAreas}

        {/* Category name or country name */}
        <text
          y={-12}
          textAnchor="middle"
          fontSize={11}
          fontWeight="600"
          fill="#374151"
        >
          {activeSlice ? `${activeSlice.data.name} · ${country}` : country}
        </text>

        {/* Category value or total energy */}
        <text
          y={10}
          textAnchor="middle"
          fontSize={12}
          fontWeight="600"
          fill="#374151"
        >
          {activeSlice
            ? `${formatValue(activeSlice.data.value)} TWh`
            : `${data.primary_energy?.toFixed(0)} TWh`}
        </text>

        {/* Category share or year */}
        <text y={30} textAnchor="middle" fontSize={10} fill="#6B7280">
          {activeSlice ? `${activeShare.toFixed(1)}% of mix` : "2024"}
        </text>
      </g>
    </svg>
  );
}
