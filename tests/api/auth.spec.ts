import { parseContract } from '../../src/api/client/parseContract';
import { readJson } from '../../src/api/client/readJson';
import { demoAdmin } from '../../src/api/data/credentials';
import { expect, test } from '../../src/api/fixtures/test';
import { authFailureSchema, authSuccessSchema } from '../../src/api/schemas/booking';

test.describe('Authentication', () => {
  test(
    'issues a token for the public demo admin',
    { tag: ['@smoke', '@regression'] },
    async ({ booker }) => {
      const response = await booker.authenticate(demoAdmin.username, demoAdmin.password);

      expect(response.status()).toBe(200);
      const body = parseContract(authSuccessSchema, await readJson(response));
      expect(body.token.length).toBeGreaterThan(0);
    },
  );

  // Restful-Booker reports bad credentials in the body and still returns HTTP 200.
  test('reports bad credentials in the body', { tag: ['@regression'] }, async ({ booker }) => {
    const response = await booker.authenticate(demoAdmin.username, 'not-the-password');

    expect(response.status()).toBe(200);
    const body = parseContract(authFailureSchema, await readJson(response));
    expect(body.reason).toBe('Bad credentials');
  });
});
