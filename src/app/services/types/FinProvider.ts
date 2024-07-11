export type FinProvider = string;

export type FinProviderMapping = {
  defaultOrderSize: number;
  exchange: string;
  symbol: string;
}

export type FinProviderMappings = Record<FinProvider, FinProviderMapping>;
