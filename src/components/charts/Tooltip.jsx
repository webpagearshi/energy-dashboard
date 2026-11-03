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
      <b style={{ color }}>
        {name} — {country}
      </b>

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
