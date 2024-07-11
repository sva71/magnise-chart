import { HttpMethod } from "./utils";
import { FinProvider } from "../types/FinProvider";

export const route = `/api/instruments/v1/providers`;
export const method = 'GET' satisfies HttpMethod;

export type Resp = { data: FinProvider[] }
