import { HttpMethod, PaginatedArg, PaginatedResp } from "./utils";
import { Instrument } from "../types/Instrument";

export const route = `/api/instruments/v1/instruments`;
export const method = 'GET' satisfies HttpMethod;

type ListInstrumentsArg = {
  provider?: string;
  kind?: string;
  symbol?: string;
}

export type Arg = PaginatedArg<ListInstrumentsArg>;
export type Resp = PaginatedResp<Instrument>;
