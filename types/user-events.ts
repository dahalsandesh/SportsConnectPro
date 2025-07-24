import { ApiResponse } from './api';

export interface RegisteredEvent {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventImage?: string;
  status: 'registered' | 'cancelled' | 'completed';
  registeredAt: string;
}

export interface RegisterForEventRequest {
  userId: string;
  eventId: string;
}

export interface GetRegisteredEventsResponse extends ApiResponse<RegisteredEvent[]> {}
export interface RegisterForEventResponse extends ApiResponse<{ id: string }> {}
