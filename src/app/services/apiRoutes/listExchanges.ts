import { HttpMethod } from "./utils";
import { FinProvider } from "../types/FinProvider";
import { Exchange } from "../types/Exchange";

export const route = `/api/instruments/v1/exchanges`;
export const method = 'GET' satisfies HttpMethod;

export type Arg = { provider?: FinProvider }
export type Resp = { data: Exchange }
