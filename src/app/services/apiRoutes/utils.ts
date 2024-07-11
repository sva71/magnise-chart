export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type PaginationArg = {
  page: number;
  size: number;
};

export type PaginatedArg<T> = Partial<T> & Partial<PaginationArg>;

export type PaginationResp = {
  page: number;
  pages: number;
  items: number;
};

export type PaginatedResp<T> = { data: T[] } & { paging: PaginationResp };

export type ChartType = 'live' | 'historical';
export type HistoricalChartType = 'count-back' | 'date-range';
export type ChartPeriodicity = 'minute' | 'hour' | 'day';
