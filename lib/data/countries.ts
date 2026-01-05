export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  currency: Currency;
}

export const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    currency: { code: "USD", symbol: "$", name: "US Dollar" },
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: { code: "GBP", symbol: "£", name: "British Pound" },
  },
  {
    code: "IN",
    name: "India",
    currency: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  },
  {
    code: "CA",
    name: "Canada",
    currency: { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  },
  {
    code: "AU",
    name: "Australia",
    currency: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  },
  {
    code: "DE",
    name: "Germany",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    code: "FR",
    name: "France",
    currency: { code: "EUR", symbol: "€", name: "Euro" },
  },
  {
    code: "JP",
    name: "Japan",
    currency: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  },
  {
    code: "CN",
    name: "China",
    currency: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  },
  {
    code: "SG",
    name: "Singapore",
    currency: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  },
];

export const getCurrencyByCountryCode = (
  countryCode: string
): Currency | undefined => {
  const country = countries.find((c) => c.code === countryCode);
  return country?.currency;
};

export const uniqueCurrencies = Array.from(
  new Map(countries.map((c) => [c.currency.code, c.currency])).values()
);
