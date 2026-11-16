import type { BookerClient } from '../client/bookerClient';
import { parseContract } from '../client/parseContract';
import { readJson } from '../client/readJson';
import { buildBooking } from '../builders/bookingBuilder';
import type { Booking, BookingInput, CreatedBooking } from '../schemas/booking';
import { createdBookingSchema } from '../schemas/booking';

type Tracker = {
  track(id: number): void;
};

export async function createTrackedBooking(
  booker: BookerClient,
  tracker: Tracker,
  overrides: Partial<BookingInput> = {},
): Promise<{ id: number; input: BookingInput; created: CreatedBooking; booking: Booking }> {
  const input = buildBooking(overrides);
  const response = await booker.createBooking(input);
  if (response.status() !== 200) {
    throw new Error(
      `Creating a booking failed with HTTP ${response.status()}: ${(await response.text()).slice(0, 300)}`,
    );
  }

  const created = parseContract(createdBookingSchema, await readJson(response));
  tracker.track(created.bookingid);
  return {
    id: created.bookingid,
    input,
    created,
    booking: created.booking,
  };
}
