import { FinProvider } from './FinProvider';

export type Bar = {
  t: Date;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type BarsArg = {
  instrumentId: string;
  provider: FinProvider;
  interval: number;
  periodicity: 'minute' | 'hour' | 'day';
};
