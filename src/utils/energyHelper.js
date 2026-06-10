// Helper function to calculate KPI metrics for a given energy record
export function getKPIMetrics(record) {
  const renewableEnergy =
    record.hydro +
    record.solar +
    record.wind +
    record.biofuel +
    record.other_renewable;

  const fossilFuelEnergy = record.coal + record.oil + record.gas;

  return {
    primaryEnergy: record.primary_energy,

    renewablePct: (renewableEnergy / record.primary_energy) * 100,

    nuclearPct: (record.nuclear / record.primary_energy) * 100,

    fossilFuelPct: (fossilFuelEnergy / record.primary_energy) * 100,
  };
}

// Helper function to transform raw energy data into a format suitable for the stacked area chart
export function getStackedAreaData(data) {
  return data.map((d) => ({
    year: d.year,

    coal: d.coal,
    oil: d.oil,
    gas: d.gas,
    nuclear: d.nuclear,
    hydro: d.hydro,
    solar: d.solar,
    wind: d.wind,
    biofuel: d.biofuel,
    other_renewable: d.other_renewable,
  }));
}
