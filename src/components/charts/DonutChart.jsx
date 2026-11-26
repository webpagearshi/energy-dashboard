import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function DonutChart({
  width,
  height,
  data,
  country,
  activeCategory,
  onCategoryHover,
}) {
  const slicesRef = useRef(null);
  const previousCountryRef = useRef(null);
  const hasRenderedRef = useRef(false);

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

  const energyMix = data
    ? [
        { name: "Coal", key: "coal", value: data.coal },
        { name: "Oil", key: "oil", value: data.oil },
        { name: "Gas", key: "gas", value: data.gas },
        { name: "Nuclear", key: "nuclear", value: data.nuclear },
        { name: "Hydro", key: "hydro", value: data.hydro },
        { name: "Solar", key: "solar", value: data.solar },
        { name: "Wind", key: "wind", value: data.wind },
        { name: "Biofuel", key: "biofuel", value: data.biofuel },
        {
          name: "Other Renewable",
          key: "other_renewable",
          value: data.other_renewable,
        },
      ].filter((d) => Number.isFinite(d.value) && d.value > 0)
    : [];

  const pieData = d3
    .pie()
    .value((d) => d.value)
    .sort(null)(energyMix);

  const radius = Math.min(width, height) / 2 - 30;

  const arcGenerator = d3
    .arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius);

  const activeArcGenerator = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius + 6);

  // Country-change animation and initial rendering.
  useEffect(() => {
    if (!slicesRef.current) return;

    const root = d3.select(slicesRef.current);

    const isFirstRender = !hasRenderedRef.current;

    const countryChanged =
      previousCountryRef.current !== null &&
      previousCountryRef.current !== country;

    const duration = countryChanged ? 750 : 180;

    const slices = root
      .selectAll("g.donut-slice")
      .data(pieData, (d) => d.data.key);

    // Remove categories that no longer have a value.
    slices
      .exit()
      .interrupt()
      .transition()
      .duration(duration)
      .attr("opacity", 0)
      .remove();

    // Add new categories.
    const entering = slices
      .enter()
      .append("g")
      .attr("class", "donut-slice")
      .attr("opacity", 1);

    entering.append("path");

    const merged = entering.merge(slices);

    merged.each(function (d) {
      const group = d3.select(this);
      const path = group.select("path");

      // Draw the complete donut on initial render.
      if (isFirstRender) {
        this._current = d;

        path
          .attr("d", arcGenerator(d))
          .attr("fill", colors(d.data.key))
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("opacity", 1);

        group.attr("transform", "translate(0,0)");

        return;
      }

      // Previous geometry for the transition.
      const previous = this._current || {
        ...d,
        startAngle: (d.startAngle + d.endAngle) / 2,
        endAngle: (d.startAngle + d.endAngle) / 2,
      };

      const interpolate = d3.interpolate(previous, d);

      group
        .interrupt()
        .transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .tween("donut-shape", () => {
          return (t) => {
            const current = interpolate(t);

            this._current = current;

            path
              .attr("d", arcGenerator(current))
              .attr("fill", colors(d.data.key));
          };
        });
    });

    // Hover interaction.
    merged.on("pointerenter", (event, d) => {
      onCategoryHover(d.data.key);
    });

    hasRenderedRef.current = true;
    previousCountryRef.current = country;
  }, [country, data, width, height]);

  // Independent category highlighting.
  useEffect(() => {
    if (!slicesRef.current) return;

    d3.select(slicesRef.current)
      .selectAll("g.donut-slice")
      .each(function (d) {
        const isActive = activeCategory === d.data.key;
        const current = this._current || d;

        const [cx, cy] = arcGenerator.centroid(current);
        const length = Math.hypot(cx, cy) || 1;
        const offset = isActive ? 7 : 0;

        d3.select(this)
          .interrupt()
          .attr(
            "transform",
            `translate(${(cx / length) * offset}, ${(cy / length) * offset})`,
          );

        d3.select(this)
          .select("path")
          .interrupt()
          .attr(
            "d",
            isActive ? activeArcGenerator(current) : arcGenerator(current),
          )
          .attr("stroke", isActive ? "black" : "white")
          .attr("stroke-width", isActive ? 0.5 : 2)
          .attr("opacity", activeCategory === null || isActive ? 1 : 0.25);
      });
  }, [activeCategory, width, height]);

  const activeSlice = pieData.find(
    (slice) => slice.data.key === activeCategory,
  );

  const totalEnergy = d3.sum(energyMix, (d) => d.value);

  const activeShare = activeSlice
    ? (activeSlice.data.value / totalEnergy) * 100
    : 0;

  const formatValue = d3.format(",.1f");

  return (
    <svg
      width={width}
      height={height}
      onPointerLeave={() => onCategoryHover(null)}
    >
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <g ref={slicesRef} />

        <text
          y={-12}
          textAnchor="middle"
          fontSize={11}
          fontWeight="600"
          fill="#374151"
        >
          {activeSlice ? `${activeSlice.data.name} · ${country}` : country}
        </text>

        <text
          y={10}
          textAnchor="middle"
          fontSize={12}
          fontWeight="600"
          fill="#374151"
        >
          {activeSlice
            ? `${formatValue(activeSlice.data.value)} TWh`
            : `${data?.primary_energy?.toFixed(0)} TWh`}
        </text>

        <text y={30} textAnchor="middle" fontSize={10} fill="#6B7280">
          {activeSlice ? `${activeShare.toFixed(1)}% of mix` : "2024"}
        </text>
      </g>
    </svg>
  );
}
