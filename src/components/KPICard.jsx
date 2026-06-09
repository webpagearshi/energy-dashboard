import "./KPICard.css";

export default function KPICard({ title, name, value, subtitle }) {
  return (
    <div className="kpi-card">
      <p className="kpi-title text-gray-400">{title}</p>
      <p className="kpi-name text-lg text-gray-500">{name}</p>
      <h2 className="kpi-value">{value}</h2>

      {subtitle && (
        <p className="kpi-subtitle text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
