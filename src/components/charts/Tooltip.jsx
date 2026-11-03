import "./Tooltip.css";

export default function Tooltip({ interactionData }) {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, xValue, yValue, color, country } = interactionData;

  return (
    <div
      className="chart-tooltip"
      style={{
        left: `${xPos}px`,
        top: `${yPos}px`,
        borderColor: color,
      }}
    >
      <div style={{ fontSize: "12px", marginBottom: "4px" }}>
        <strong style={{ color, fontWeight: 600 }}>{name}</strong>

        <span style={{ color: "#6b7280", fontWeight: 600 }}> — {country}</span>
      </div>

      <p>Year: {xValue}</p>

      <p>
        Energy Consumption:{" "}
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 1,
        }).format(yValue)}{" "}
        TWh
      </p>
    </div>
  );
}
