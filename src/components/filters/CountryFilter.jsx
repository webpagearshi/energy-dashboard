export default function CountryFilter({
  countries,
  selectedCountry,
  setSelectedCountry,
}) {
  return (
    <select
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.target.value)}
      className="border rounded-lg px-3 py-4 text-[10px] text-gray-600 margin-5 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
    >
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}
