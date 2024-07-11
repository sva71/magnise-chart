import { HttpMethod } from './utils';
import { Bar, BarsArg } from '../types/Bar';

export const route = 'api/bars/v1/bars/count-back';
export const method = 'GET' satisfies HttpMethod;

export type Arg = BarsArg & { barsCount: number };
export type Resp = { data: Bar[] };
