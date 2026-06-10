import { useMemo, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { energyData } from "../data/energy";
import KPICard from "./KPICard";
import "./Dashboard.css";
import { getKPIMetrics } from "../utils/energyHelper";
import ResponsiveStackedAreaChart from "./charts/ResponsiveStackedAreaChart";
import { getStackedAreaData } from "../utils/energyHelper";
import ResponsiveDonutChart from "./charts/ResponsiveDonutChart";

export default function Dashboard() {
  const countries = useMemo(() => {
    const uniqueCountries = [
      ...new Set(energyData.map((d) => d.country)),
    ].sort();

    return uniqueCountries.sort();
  }, []);

  const [selectedCountry, setSelectedCountry] = useState("World");

  // Get the data for the selected country in 2024
  const country2024 = energyData.find(
    (d) => d.country === selectedCountry && d.year === 2024,
  );
  // Handle case where data for 2024 might not be available
  const metrics = country2024
    ? getKPIMetrics(country2024)
    : {
        primaryEnergy: null,
        renewablePct: null,
        nuclearPct: null,
        fossilFuelPct: null,
      };
  // Get the time series data for the selected country
  const countryData = energyData.filter((d) => d.country === selectedCountry);
  // Transform the data for the stacked area chart
  const stackedAreaData = getStackedAreaData(countryData);

  return (
    <div className="min-h-screen bg-gray-50 dashboard shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <DashboardHeader
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
      </div>
      <div className="kpi-grid mt-8">
        <KPICard
          title="TOTAL PRIMARY ENERGY 2024"
          name={selectedCountry}
          value={
            metrics.primaryEnergy !== null
              ? metrics.primaryEnergy.toFixed(1)
              : "No Data"
          }
          subtitle="consumption measured in TWh"
        />

        <KPICard
          title="RENEWABLE ENERGY 2024"
          name={selectedCountry}
          value={
            metrics.renewablePct !== null
              ? `${metrics.renewablePct.toFixed(1)}%`
              : "No Data"
          }
          subtitle="% of total energy consumption"
        />

        <KPICard
          title="NUCLEAR ENERGY 2024"
          name={selectedCountry}
          value={
            metrics.nuclearPct !== null
              ? `${metrics.nuclearPct.toFixed(1)}%`
              : "No Data"
          }
          subtitle="% of total energy consumption"
        />

        <KPICard
          title="FOSSIL FUELS 2024"
          name={selectedCountry}
          value={
            metrics.fossilFuelPct !== null
              ? `${metrics.fossilFuelPct.toFixed(1)}%`
              : "No Data"
          }
          subtitle="coal+oil+gas"
        />
      </div>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResponsiveStackedAreaChart data={stackedAreaData} />
          </div>

          <div>
            <ResponsiveDonutChart country={selectedCountry} />
          </div>
        </div>
      </div>
    </div>
  );
}
