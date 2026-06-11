import { useMemo, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { energyData } from "../data/energy";
import KPICard from "./KPICard";
import "./Dashboard.css";
import {
  getKPIMetrics,
  getStackedAreaData,
  getTopEnergyCountries,
} from "../utils/energyHelper";

import ResponsiveStackedAreaChart from "./charts/ResponsiveStackedAreaChart";
import ResponsiveDonutChart from "./charts/ResponsiveDonutChart";
import ResponsiveBarChart from "./charts/ResponsiveBarChart";

export default function Dashboard() {
  const countries = useMemo(() => {
    return [...new Set(energyData.map((d) => d.country))].sort();
  }, []);

  const [selectedCountry, setSelectedCountry] = useState("World");

  const country2024 = energyData.find(
    (d) => d.country === selectedCountry && d.year === 2024,
  );

  const metrics = country2024
    ? getKPIMetrics(country2024)
    : {
        primaryEnergy: null,
        renewablePct: null,
        nuclearPct: null,
        fossilFuelPct: null,
      };

  const countryData = energyData.filter((d) => d.country === selectedCountry);

  const stackedAreaData = getStackedAreaData(countryData);

  const topCountriesData = getTopEnergyCountries(energyData, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <DashboardHeader
          countries={countries}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />

        {/* KPI Row */}
        <div className="kpi-grid">
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
            subtitle="coal + oil + gas"
          />
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ResponsiveStackedAreaChart data={stackedAreaData} />
          </div>

          <ResponsiveDonutChart data={country2024} country={selectedCountry} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ResponsiveBarChart
            data={topCountriesData}
            selectedCountry={selectedCountry}
          />

          <div className="bg-white rounded-xl shadow h-[500px] flex items-center justify-center text-gray-400 text-lg">
            Future Chart
          </div>
        </div>
      </div>
    </div>
  );
}
