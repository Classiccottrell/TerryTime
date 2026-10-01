/** Countries the shop ships to. Printful fulfils both from North American facilities. */
export type CountryCode = "CA" | "US";

export const COUNTRIES: { code: CountryCode; name: string; regionLabel: string; postalLabel: string }[] = [
  { code: "CA", name: "Canada", regionLabel: "Province", postalLabel: "Postal code" },
  { code: "US", name: "United States", regionLabel: "State", postalLabel: "ZIP code" },
];

export const REGIONS: Record<CountryCode, [code: string, name: string][]> = {
  CA: [
    ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"], ["NB", "New Brunswick"],
    ["NL", "Newfoundland and Labrador"], ["NS", "Nova Scotia"], ["NT", "Northwest Territories"],
    ["NU", "Nunavut"], ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"],
    ["SK", "Saskatchewan"], ["YT", "Yukon"],
  ],
  US: [
    ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
    ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
    ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
    ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
    ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
    ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
    ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
    ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"],
    ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
    ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
    ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
  ],
};

export type Destination = { country: CountryCode; state: string; postalCode: string };

const POSTAL: Record<CountryCode, RegExp> = {
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  US: /^\d{5}(-\d{4})?$/,
};

/** Validates untrusted input into a Destination, or returns an error message for the buyer. */
export function parseDestination(input: unknown): { ok: true; destination: Destination } | { ok: false; error: string } {
  const raw = (input ?? {}) as Partial<Record<keyof Destination, unknown>>;
  const country = raw.country === "CA" || raw.country === "US" ? raw.country : null;
  if (!country) return { ok: false, error: "Pick Canada or the United States." };
  const state = typeof raw.state === "string" ? raw.state.toUpperCase() : "";
  if (!REGIONS[country].some(([code]) => code === state)) {
    return { ok: false, error: `Pick a ${country === "CA" ? "province" : "state"}.` };
  }
  const postalCode = typeof raw.postalCode === "string" ? raw.postalCode.trim().toUpperCase() : "";
  if (!POSTAL[country].test(postalCode)) {
    return { ok: false, error: country === "CA" ? "Enter a valid postal code, like V5N 4B6." : "Enter a valid ZIP code, like 10001." };
  }
  return { ok: true, destination: { country, state, postalCode } };
}
