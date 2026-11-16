import { test as base, expect } from '@playwright/test';
import { BookerClient } from '../client/bookerClient';
import { parseContract } from '../client/parseContract';
import { readJson } from '../client/readJson';
import { demoAdmin } from '../data/credentials';
import { authSuccessSchema } from '../schemas/booking';

type ApiFixtures = {
  booker: BookerClient;
  token: string;
  createdBookingIds: {
    track(id: number): void;
  };
};

export const test = base.extend<ApiFixtures>({
  booker: async ({ request }, use) => {
    await use(new BookerClient(request));
  },
  token: async ({ booker }, use) => {
    const response = await booker.authenticate(demoAdmin.username, demoAdmin.password);
    expect(response.status(), 'demo admin login should return a token').toBe(200);
    const body = parseContract(authSuccessSchema, await readJson(response));
    await use(body.token);
  },
  createdBookingIds: async ({ booker, token }, use) => {
    const ids: number[] = [];
    await use({
      track(id: number) {
        ids.push(id);
      },
    });

    for (const id of ids) {
      const response = await booker.deleteBooking(id, token);
      // 201 deleted now, 404 already gone, 405 is what a second delete returns.
      expect(
        [201, 404, 405],
        `cleanup for booking ${id} returned HTTP ${response.status()}`,
      ).toContain(response.status());
    }
  },
});

export { expect };
