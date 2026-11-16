import type { BookingInput } from '../schemas/booking';

export function buildBooking(overrides: Partial<BookingInput> = {}): BookingInput {
  const suffix = crypto.randomUUID();
  return {
    firstname: 'Maxat',
    lastname: `QA${suffix}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-05',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
