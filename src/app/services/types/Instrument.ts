import { FinProviderMappings } from "./FinProvider";

export type Instrument = {
  id: string;
  kind: string;
  baseCurrency: string;
  currency: string;
  description: string;
  mappings: FinProviderMappings & {
    symbol: string;
    tickSize: number;
  }
  symbol: string;
  tickSize: number;
}

