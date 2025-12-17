// locationApi.ts

// Define the required structure for react-select options
export type Option = {
  label: string;
  value: string;
};

export async function fetchCountries(): Promise<Option[]> {
  // Fetch data from the API endpoint
  const res = await fetch(
    "http://65.2.128.237:8000/api/v1/rfps/?limit=500"
  );
  
  if (!res.ok) {
    console.error("Failed to fetch RFPs data:", res.statusText);
    return [];
  }
  
  const data = await res.json();

  // 1. Extract location, filter out null/empty values, and grab the first part (country)
  const countryNames: string[] = data.map((item: any) => item.location)
    .filter(Boolean)
    .map((loc: string) => loc.split(",")[0].trim());

  // 2. Get unique country names and sort them
  const uniqueCountryNames = Array.from(new Set(countryNames)).sort();

  // 3. Map the string names into the required { label, value } Option format
  const countries: Option[] = uniqueCountryNames.map(name => ({
    label: name,
    value: name, // Use the name as both label and value
  }));

  return countries;
}
