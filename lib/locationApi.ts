// locationApi.ts

// Structure required by react-select
export type Option = {
  label: string;
  value: string;
};

// Minimal shape of RFP item needed for country extraction
type RfpItem = {
  location?: string | null;
};

export async function fetchCountries(): Promise<Option[]> {
  try {
    const res = await fetch(
      "http://65.2.128.237:8000/api/v1/rfps/?limit=500"
    );

    if (!res.ok) {
      console.error("Failed to fetch RFPs data:", res.statusText);
      return [];
    }

    const data: RfpItem[] = await res.json();

    // Extract country names from location field
    const countryNames: string[] = data
      .map((item) => item.location)
      .filter((loc): loc is string => Boolean(loc))
      .map((loc) => loc.split(",")[0].trim());

    // Remove duplicates and sort
    const uniqueCountryNames = Array.from(
      new Set(countryNames)
    ).sort();

    // Convert to react-select options
    const countries: Option[] = uniqueCountryNames.map(
      (name) => ({
        label: name,
        value: name,
      })
    );

    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}
