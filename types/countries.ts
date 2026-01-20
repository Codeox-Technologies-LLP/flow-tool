export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  currency: Currency;
}
