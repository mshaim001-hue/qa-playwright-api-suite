import { buildBooking } from '../../src/api/builders/bookingBuilder';
import { parseContract } from '../../src/api/client/parseContract';
import { readJson } from '../../src/api/client/readJson';
import { expect, test } from '../../src/api/fixtures/test';
import { bookingIdListSchema, bookingSchema } from '../../src/api/schemas/booking';
import { createTrackedBooking } from '../../src/api/support/createTrackedBooking';

test.describe('Bookings', () => {
  test(
    'creates a booking and reads it back',
    { tag: ['@smoke', '@regression'] },
    async ({ booker, createdBookingIds }) => {
      const { id, input, booking } = await createTrackedBooking(booker, createdBookingIds);

      expect(booking).toMatchObject(input);

      const response = await booker.getBooking(id);
      expect(response.status()).toBe(200);
      expect(parseContract(bookingSchema, await readJson(response))).toEqual(booking);
    },
  );

  test(
    'replaces a booking',
    { tag: ['@regression'] },
    async ({ booker, token, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);
      const replacement = buildBooking({
        totalprice: 333,
        depositpaid: false,
        additionalneeds: 'Lunch',
      });

      const response = await booker.replaceBooking(id, replacement, { token });
      expect(response.status()).toBe(200);
      expect(parseContract(bookingSchema, await readJson(response))).toMatchObject(replacement);

      const fetched = await booker.getBooking(id);
      expect(fetched.status()).toBe(200);
      expect(parseContract(bookingSchema, await readJson(fetched))).toMatchObject(replacement);
    },
  );

  test(
    'patches one field and leaves the rest',
    { tag: ['@regression'] },
    async ({ booker, token, createdBookingIds }) => {
      const { id, input } = await createTrackedBooking(booker, createdBookingIds);

      const response = await booker.patchBooking(id, { additionalneeds: 'Late checkout' }, token);
      expect(response.status()).toBe(200);

      const body = parseContract(bookingSchema, await readJson(response));
      expect(body.additionalneeds).toBe('Late checkout');
      expect(body.firstname).toBe(input.firstname);
      expect(body.lastname).toBe(input.lastname);
      expect(body.totalprice).toBe(input.totalprice);
      expect(body.depositpaid).toBe(input.depositpaid);
    },
  );

  test(
    'deletes a booking',
    { tag: ['@regression'] },
    async ({ booker, token, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);

      const response = await booker.deleteBooking(id, token);
      expect(response.status()).toBe(201);
      expect(await response.text()).toContain('Created');

      const fetched = await booker.getBooking(id);
      expect(fetched.status()).toBe(404);
      expect(await fetched.text()).toContain('Not Found');
    },
  );

  test('lists booking ids', { tag: ['@regression'] }, async ({ booker }) => {
    const response = await booker.listBookings();

    expect(response.status()).toBe(200);
    const ids = parseContract(bookingIdListSchema, await readJson(response));
    expect(ids.length).toBeGreaterThan(0);
  });
});
