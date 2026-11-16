import { messages, users } from '../../src/ui/data/users';
import { expect, test } from '../../src/ui/fixtures/test';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    'signs in the standard user',
    { tag: ['@smoke', '@regression'] },
    async ({ loginPage, inventoryPage, page }) => {
      await loginPage.signIn(users.standard.username, users.standard.password);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.itemNames).not.toHaveCount(0);
    },
  );

  test('rejects the locked out user', { tag: ['@regression'] }, async ({ loginPage, page }) => {
    await loginPage.signIn(users.lockedOut.username, users.lockedOut.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.error).toHaveText(messages.lockedOut);
  });

  test('rejects unknown credentials', { tag: ['@regression'] }, async ({ loginPage, page }) => {
    await loginPage.signIn(users.invalid.username, users.invalid.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.error).toHaveText(messages.invalidCredentials);
  });

  test('requires a username', { tag: ['@regression'] }, async ({ loginPage }) => {
    await loginPage.signIn('', users.standard.password);

    await expect(loginPage.error).toHaveText(messages.usernameRequired);
  });

  test('requires a password', { tag: ['@regression'] }, async ({ loginPage }) => {
    await loginPage.signIn(users.standard.username, '');

    await expect(loginPage.error).toHaveText(messages.passwordRequired);
  });
});
