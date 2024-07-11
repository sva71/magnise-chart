import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SubscriptionMessage } from '../types/SubscriptionMessages';
import { LiveChartItem } from '../types/LiveChart';
import { WebsocketService } from '../websocket/websocket.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LiveChartService implements OnDestroy {
  private _lastItem: LiveChartItem = { tick: '' };

  public newItem$: Subject<LiveChartItem> = new Subject();

  constructor(private webSocket: WebsocketService) {
    this.webSocket.isActiveSubscription$.subscribe((status) => {
      if (!status) {
        this._lastItem = { tick: '' };
      }
    });
  }

  strDate(d: Date): string {
    return moment(d).format('HH:mm:ss');
  }

  addNewDataItem(item: SubscriptionMessage) {
    if ('ask' in item) {
      this._lastItem.tick = this.strDate(item.ask.timestamp);
      this._lastItem.ask = item.ask.price;
    }
    if ('bid' in item) {
      this._lastItem.tick = this.strDate(item.bid.timestamp);
      this._lastItem.bid = item.bid.price;
    }
    if ('last' in item) {
      this._lastItem.tick = this.strDate(item.last.timestamp);
      this._lastItem.last = item.last.price;
    }
    this.newItem$.next(this._lastItem);
  }

  ngOnDestroy() {
    this.newItem$.complete();
  }
}
