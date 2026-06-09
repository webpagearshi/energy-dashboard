export function parseEnergyData(data) {
  return data.map((d) => ({
    country: d.country,
    year: +d.year,

    primary_energy: +d.primary_energy || 0,

    coal: +d.coal || 0,
    oil: +d.oil || 0,
    gas: +d.gas || 0,
    nuclear: +d.nuclear || 0,
    hydro: +d.hydro || 0,
    solar: +d.solar || 0,
    wind: +d.wind || 0,
    biofuel: +d.biofuel || 0,
    other_renewable: +d.other_renewable || 0,
  }));
}
