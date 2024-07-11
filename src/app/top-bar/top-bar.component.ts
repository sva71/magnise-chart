import {
  Component,
  ElementRef, Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { DataService, IHistoricalSettings } from '../services/data.service';
import {Observable, Subscription, tap} from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatOption,
  MatSelect,
} from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { WebsocketService } from '../services/websocket/websocket.service';
import { SubscriptionRequest } from '../services/types/SubscriptionMessages';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { LiveChartService } from '../services/liveChart/live-chart.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { FinProvider } from '../services/types/FinProvider';
import { Instrument } from '../services/types/Instrument';
import {ChartType, PaginationResp} from '../services/apiRoutes/utils';
import { FormsModule } from '@angular/forms';
import {
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatInput} from "@angular/material/input";
import {AsyncPipe, DatePipe} from "@angular/common";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    MatButton,
    MatGridList,
    MatGridTile,
    MatCheckbox,
    FormsModule,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    MatAutocomplete,
    MatInput,
    MatAutocompleteTrigger,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent implements OnInit, OnDestroy {
  lastPrice: string;
  lastTime: string;
  isActiveSubscription = false;
  status = '';
  loading = false;

  finProviders: Observable<FinProvider[]> = this.dataService.loadProviders().pipe(tap(() => this.dataService.statusData$.next('Providers loaded')));
  instruments: Instrument[] = [];
  instrumentsPaging: PaginationResp = { page: 0, pages: 0, items: 0 };
  historicalSettings: IHistoricalSettings;

  typedSymbol = '';
  inputTimeout = null;

  selectedProvider: FinProvider = null;
  selectedInstrument: Instrument = null;
  subscribedProvider: FinProvider = null;
  subscribedInstrument: Instrument = null;

  socketSubscription: Subscription;

  subscriptionRequest: SubscriptionRequest = {
    type: 'l1-subscription',
    id: '1',
    instrumentId: '',
    provider: '',
    subscribe: true,
    kinds: ['ask', 'bid', 'last'],
  };

  private readonly THRESHOLD_SCROLL_POSITION = 10;
  @ViewChild('auto') instrumentSelect: MatAutocomplete;

  @Input() chartType: ChartType = 'live';

  constructor(
    private dataService: DataService,
    private webSocket: WebsocketService,
    private liveChartService: LiveChartService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.webSocket.isActiveSubscription$.subscribe((status) => {
      this.isActiveSubscription = status;
      if (status) {
        this.subscribedProvider = this.selectedProvider;
        this.subscribedInstrument = { ...this.selectedInstrument };
      }
    });
    this.dataService.statusData$.subscribe((s) => (this.status = s));
    this.dataService.historicalSettings$.subscribe(
      (s) => (this.historicalSettings = s),
    );
    this.dataService.statusData$.next('Reading providers...');
    this.socketSubscription = this.webSocket.connect().subscribe({
      next: (msg) => {
        if (msg.type === 'l1-update') {
          if ('last' in msg) {
            this.lastPrice = msg.last.price.toLocaleString();
            this.lastTime = moment(msg.last.timestamp).format(
              'DD.MM.YYYY HH:mm:ss',
            );
          }
          this.liveChartService.addNewDataItem(msg);
        }
      },
    });
  }

  registerPanelScrollEvent() {
    let panel: HTMLElement | null;
    setTimeout(() => {
      panel =
        (this.instrumentSelect?.panel as ElementRef<HTMLElement>)
          ?.nativeElement || null;
      panel &&
        panel.addEventListener('scroll', (event: UIEvent) => {
          const target = event.target as HTMLElement;
          const scrollBottom = target.scrollHeight - target.scrollTop;
          if (
            scrollBottom <
            target.clientHeight + this.THRESHOLD_SCROLL_POSITION
          ) {
            if (
              this.instrumentsPaging.page &&
              this.instrumentsPaging.page < this.instrumentsPaging.pages &&
              !this.loading
            ) {
              this.getProvidersInstruments();
            }
          }
        });
    }, 0);
  }

  getProvidersInstruments() {
    const symbol = this.typedSymbol;
    this.selectedInstrument = null;
    this.dataService.statusData$.next('Reading instruments...');
    this.loading = true;
    this.dataService
      .loadInstruments({
        kind: 'forex',
        provider: this.selectedProvider,
        page: this.instrumentsPaging.page ? this.instrumentsPaging.page + 1 : 1,
        size: 10,
        symbol,
      })
      .subscribe({
        next: (resp) => {
          this.instrumentsPaging.page === 0
            ? (this.instruments = [...resp.data])
            : this.instruments.push(...resp.data);
          this.instrumentsPaging = { ...resp.paging };
          this.dataService.statusData$.next('Instruments loaded');
        },
        error: (err) => console.error(err),
        complete: () => (this.loading = false),
      });
  }

  clearInstruments() {
    this.instruments = [];
    this.instrumentsPaging = { page: 0, pages: 0, items: 0 };
  }

  providerChanged() {
    this.clearInstruments();
    this.getProvidersInstruments();
  }

  instrumentInput() {
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }
    this.clearInstruments();
    this.inputTimeout = setTimeout(() => {
      this.getProvidersInstruments();
    }, 500);
  }

  stop(): void {
    this.webSocket.send({
      ...this.subscriptionRequest,
      subscribe: false,
    });
    this.webSocket.isActiveSubscription$.next(false);
  }

  wsSubscribe(): void {
    if (this.isActiveSubscription) {
      this.stop();
    } else {
      this.dataService.chartType = 'live';
      this.subscriptionRequest = {
        ...this.subscriptionRequest,
        provider: this.selectedProvider,
        instrumentId: this.selectedInstrument.id,
      };
      this.webSocket.send(this.subscriptionRequest);
      this.webSocket.isActiveSubscription$.next(true);
    }
  }

  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '600px',
      data: this.dataService.historicalSettings,
    });
    dialogRef.afterClosed().subscribe((result: IHistoricalSettings) => {
      if (result) {
        this.subscribedInstrument = this.selectedInstrument;
        this.dataService.historicalSettings = { ...result };
        this.dataService.chartType = 'historical';
        if (this.isActiveSubscription) {
          this.stop();
        }
        const payload = {
          provider: this.selectedProvider,
          instrumentId: this.selectedInstrument.id,
          interval: this.dataService.historicalSettings.interval,
          periodicity: this.dataService.historicalSettings.periodicity,
        };
        switch (this.dataService.historicalSettings.historicalChartType) {
          case 'count-back': {
            this.dataService
              .loadBarsCount({
                ...payload,
                barsCount: result.barsCount,
              })
              .subscribe({
                next: (resp) => (this.dataService.bars = [...resp.data]),
                error: (err) => console.error(err),
              });
            break;
          }
          case 'date-range': {
            this.dataService
              .loadDateRange({
                ...payload,
                startDate: moment(result.dateFrom).format('YYYY-MM-DD'),
                endDate: moment(result.dateTo).format('YYYY-MM-DD'),
              })
              .subscribe({
                next: (resp) => (this.dataService.bars = [...resp.data]),
                error: (err) => console.error(err),
              });
            break;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.webSocket.close();
  }
}
