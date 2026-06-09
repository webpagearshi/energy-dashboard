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
