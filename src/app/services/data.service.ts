import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject, Observable, map, tap} from 'rxjs';
import * as Routes from './apiRoutes';
import {
  ChartPeriodicity,
  ChartType,
  HistoricalChartType,
} from './apiRoutes/utils';
import { Bar } from './types/Bar';
import {FinProvider} from "./types/FinProvider";

export interface IHistoricalSettings {
  historicalChartType: HistoricalChartType;
  interval: number;
  periodicity: ChartPeriodicity;
  barsCount: number;
  dateFrom: Date;
  dateTo: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public statusData$: Subject<string> = new Subject();
  public bars$: Subject<boolean> = new Subject();
  public chartType$: Subject<ChartType> = new Subject();
  public historicalSettings$: Subject<IHistoricalSettings> = new Subject();

  private _chartType: ChartType = 'live';
  private _bars: Bar[] = [];

  private _historicalSettings: IHistoricalSettings = {
    historicalChartType: 'count-back',
    interval: 1,
    periodicity: 'minute',
    barsCount: 100,
    dateFrom: new Date(),
    dateTo: new Date(),
  };

  get chartType(): ChartType {
    return this._chartType;
  }

  set chartType(value: ChartType) {
    this.chartType$.next(value);
    this._chartType = value;
  }

  get bars(): Bar[] {
    return this._bars;
  }

  set bars(value: Bar[]) {
    this._bars = value;
    this.bars$.next(true);
  }

  get historicalSettings(): IHistoricalSettings {
    return this._historicalSettings;
  }

  set historicalSettings(value: IHistoricalSettings) {
    this._historicalSettings = value;
    this.historicalSettings$.next(value);
  }

  constructor(private httpClient: HttpClient) {}

  loadProviders(): Observable<FinProvider[]> {
    this.statusData$.next('Reading providers...');
    return this.httpClient.request<Routes.ListProviders.Resp>(
      Routes.ListProviders.method,
      Routes.ListProviders.route,
    ).pipe(map(res => res.data)).pipe(tap(() => this.statusData$.next('Providers loaded')));
  }

  loadInstruments(
    arg: Routes.ListInstruments.Arg,
  ): Observable<Routes.ListInstruments.Resp> {
    this.statusData$.next('Reading instruments...');
    return this.httpClient.request<Routes.ListInstruments.Resp>(
      Routes.ListInstruments.method,
      Routes.ListInstruments.route,
      { params: arg },
    ).pipe(tap(() => this.statusData$.next('Instruments loaded')));
  }

  loadExchanges(
    arg: Routes.ListExchanges.Arg,
  ): Observable<Routes.ListExchanges.Resp> {
    return this.httpClient.request<Routes.ListExchanges.Resp>(
      Routes.ListExchanges.method,
      Routes.ListExchanges.route,
      { params: arg },
    );
  }

  loadBarsCount(arg: Routes.BarsCount.Arg): Observable<Routes.BarsCount.Resp> {
    return this.httpClient.request<Routes.BarsCount.Resp>(
      Routes.BarsCount.method,
      Routes.BarsCount.route,
      { params: arg },
    );
  }

  loadDateRange(arg: Routes.DateRange.Arg): Observable<Routes.DateRange.Resp> {
    return this.httpClient.request<Routes.DateRange.Resp>(
      Routes.DateRange.method,
      Routes.DateRange.route,
      { params: arg },
    );
  }
}
