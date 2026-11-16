import { buildBooking } from '../../src/api/builders/bookingBuilder';
import { parseContract } from '../../src/api/client/parseContract';
import { readJson } from '../../src/api/client/readJson';
import { expect, test } from '../../src/api/fixtures/test';
import { bookingSchema } from '../../src/api/schemas/booking';
import { createTrackedBooking } from '../../src/api/support/createTrackedBooking';

test.describe('Booking failures', () => {
  test('returns 404 for an unknown booking', { tag: ['@regression'] }, async ({ booker }) => {
    const response = await booker.getBooking(999_999_999);

    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('Not Found');
  });

  test(
    'returns 403 when a replacement has no token',
    { tag: ['@regression'] },
    async ({ booker, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);

      const response = await booker.replaceBooking(id, buildBooking());

      expect(response.status()).toBe(403);
      expect(await response.text()).toContain('Forbidden');
    },
  );

  test(
    'returns 403 when the token is not valid',
    { tag: ['@regression'] },
    async ({ booker, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);

      const response = await booker.replaceBooking(id, buildBooking(), {
        token: 'not-a-real-token',
      });

      expect(response.status()).toBe(403);
      expect(await response.text()).toContain('Forbidden');
    },
  );

  test(
    'returns 403 when a delete has no token',
    { tag: ['@regression'] },
    async ({ booker, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);

      const response = await booker.deleteBooking(id);

      expect(response.status()).toBe(403);
      expect(await response.text()).toContain('Forbidden');
    },
  );

  // The service responds 500 instead of 400 for a payload that omits required fields.
  test(
    'returns 500 when required booking fields are missing',
    { tag: ['@regression'] },
    async ({ booker }) => {
      const response = await booker.createPartialBooking({ firstname: 'Only' });

      expect(response.status()).toBe(500);
      expect(await response.text()).toContain('Internal Server Error');
    },
  );

  // HTTP 418 here is not a rejection: the new booking is still stored.
  test(
    'returns 418 for a non-JSON accept header and still stores the update',
    { tag: ['@regression'] },
    async ({ booker, token, createdBookingIds }) => {
      const { id } = await createTrackedBooking(booker, createdBookingIds);
      const replacement = buildBooking({ firstname: 'Changed' });

      const response = await booker.replaceBooking(id, replacement, {
        token,
        accept: 'text/html',
      });

      expect(response.status()).toBe(418);
      expect(await response.text()).toContain("I'm a Teapot");

      const fetched = await booker.getBooking(id);
      expect(fetched.status()).toBe(200);
      expect(parseContract(bookingSchema, await readJson(fetched))).toMatchObject(replacement);
    },
  );
});
