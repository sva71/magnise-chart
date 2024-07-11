import {
  SubscriptionMessage,
  SubscriptionRequest,
} from '../types/SubscriptionMessages';

export const route = '/api/streaming/ws/v1/realtime';

export type Arg = SubscriptionRequest;
export type Resp = SubscriptionMessage;
