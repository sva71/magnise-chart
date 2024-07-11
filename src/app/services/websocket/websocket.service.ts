import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable, share, Subject } from 'rxjs';
import * as Routes from '../apiRoutes';
import {
  SubscriptionMessage,
  SubscriptionRequest,
} from '../types/SubscriptionMessages';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private socket: WebSocket;
  private socketPath = Routes.SocketMessages.route;

  public message$: Subject<SubscriptionMessage> =
    new Subject<SubscriptionMessage>();
  public isActiveSubscription$: Subject<boolean> = new Subject();

  constructor(private authService: AuthService) {}

  createWebSocket(token: string) {
    this.socket = new WebSocket(`${this.socketPath}/?token=${token}`);

    this.socket.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as SubscriptionMessage;
      this.message$.next(data);
    };
    this.socket.onerror = (event) => console.error(event);
    this.socket.onclose = () => this.message$.complete();
  }

  public connect(): Observable<SubscriptionMessage> {
    const token = this.authService.tokenData?.access_token || '';
    if (!token) {
      this.authService.gotToken$.subscribe((tokenData) =>
        this.createWebSocket(tokenData.access_token),
      );
    } else {
      this.createWebSocket(token);
    }

    return this.message$.asObservable().pipe(share());
  }

  public send(data: SubscriptionRequest): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('Error opening WebSocket connection');
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  ngOnDestroy(): void {
    this.close();
  }
}
