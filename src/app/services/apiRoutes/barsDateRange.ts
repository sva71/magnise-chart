import { HttpMethod } from './utils';
import { Bar, BarsArg } from '../types/Bar';

export const route = 'api/bars/v1/bars/date-range';
export const method = 'GET' satisfies HttpMethod;

export type Arg = BarsArg & {
  startDate: string;
  endDate: string;
};
export type Resp = { data: Bar[] };
