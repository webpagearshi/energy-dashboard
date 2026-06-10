import CountryFilter from "./filters/CountryFilter";

export default function DashboardHeader({
  countries,
  selectedCountry,
  setSelectedCountry,
}) {
  return (
    <header className="w-full mb-8 pb-5">
      <div className="flex w-full justify-between items-start">
        {/* Left Side */}
        <div className="flex flex-col">
          <h1 className="text-[30px] text-gray-900">
            World Energy Transition Dashboard
          </h1>

          <p className="mt-1 text-[14px] text-gray-600">
            Explore how the global energy mix has evolved since 1965.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-end">
          <CountryFilter
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />

          <div className="mt-1 text-[12px] text-gray-500">
            Dataset Period: 1965–2024 <br /> Source: Our World in Data
          </div>
        </div>
      </div>
    </header>
  );
}
