import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { BookingInput, BookingPatch } from '../schemas/booking';

type RequestOptions = {
  token?: string;
  accept?: string;
};

/**
 * Client for the public Restful-Booker API.
 * Authentication is a `token` cookie, not an Authorization header.
 * An update that does not accept JSON responds with HTTP 418 and still stores the change.
 */
export class BookerClient {
  constructor(private readonly request: APIRequestContext) {}

  authenticate(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', {
      data: { username, password },
      headers: this.headers(),
    });
  }

  listBookings(): Promise<APIResponse> {
    return this.request.get('/booking', {
      headers: { Accept: 'application/json' },
    });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
  }

  createBooking(booking: BookingInput): Promise<APIResponse> {
    return this.request.post('/booking', {
      data: booking,
      headers: this.headers(),
    });
  }

  createPartialBooking(payload: { firstname: string }): Promise<APIResponse> {
    return this.request.post('/booking', {
      data: payload,
      headers: this.headers(),
    });
  }

  replaceBooking(
    id: number,
    booking: BookingInput,
    options: RequestOptions = {},
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: this.headers(options),
    });
  }

  patchBooking(id: number, patch: BookingPatch, token: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      data: patch,
      headers: this.headers({ token }),
    });
  }

  deleteBooking(id: number, token?: string): Promise<APIResponse> {
    const options: RequestOptions = {};
    if (token !== undefined) {
      options.token = token;
    }
    return this.request.delete(`/booking/${id}`, {
      headers: this.headers(options),
    });
  }

  private headers(options: RequestOptions = {}): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: options.accept ?? 'application/json',
      'Content-Type': 'application/json',
    };
    if (options.token !== undefined) {
      headers.Cookie = `token=${options.token}`;
    }
    return headers;
  }
}
