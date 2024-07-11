import { FinProvider } from './FinProvider';

export type SubscriptionRequest = {
  type: string;
  id: string;
  instrumentId: string;
  provider: FinProvider;
  subscribe: boolean;
  kinds: ['ask', 'bid', 'last'];
};

export type TradeRequest = {
  timestamp: Date;
  price: number;
  volume: number;
};

export type TradeResult = TradeRequest & {
  change: number;
  changePct: number;
};

export type AskResult = {
  ask: TradeResult;
};

export type BidResult = {
  bid: TradeRequest;
};

export type LastResult = {
  last: TradeResult;
};

export type SubscriptionMessage = {
  type: string;
  instrumentId: string;
  provider: FinProvider;
} & (AskResult | BidResult | LastResult);
