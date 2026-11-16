import { products } from '../../src/ui/data/catalog';
import { customer, messages } from '../../src/ui/data/users';
import { checkoutTotals, parsePrice } from '../../src/ui/domain/checkoutTotals';
import { expect, test } from '../../src/ui/fixtures/test';

const missingFieldCases = [
  {
    name: 'first name',
    customer: { lastName: customer.lastName, postalCode: customer.postalCode },
    error: messages.firstNameRequired,
  },
  {
    name: 'last name',
    customer: { firstName: customer.firstName, postalCode: customer.postalCode },
    error: messages.lastNameRequired,
  },
  {
    name: 'postal code',
    customer: { firstName: customer.firstName, lastName: customer.lastName },
    error: messages.postalCodeRequired,
  },
] as const;

test.describe('Checkout', () => {
  test(
    'completes an order for one product',
    { tag: ['@smoke', '@regression'] },
    async ({
      standardUserOnInventory,
      cartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
      page,
    }) => {
      await standardUserOnInventory.add(products.backpack);
      await standardUserOnInventory.openCart();
      const price = parsePrice(
        (
          await cartPage
            .card(products.backpack)
            .getByTestId('inventory-item-price')
            .allTextContents()
        ).join(''),
      );
      const totals = checkoutTotals([price]);

      await cartPage.checkout();
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

      await checkoutInfoPage.enterCustomer(customer);
      await checkoutInfoPage.continue();
      await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
      await expect(checkoutOverviewPage.itemNames).toHaveText([products.backpack]);
      await expect(checkoutOverviewPage.payment).toHaveText('SauceCard #31337');
      await expect(checkoutOverviewPage.shipping).toHaveText('Free Pony Express Delivery!');
      await expect(checkoutOverviewPage.subtotal).toHaveText(`Item total: $${totals.subtotal}`);
      await expect(checkoutOverviewPage.tax).toHaveText(`Tax: $${totals.tax}`);
      await expect(checkoutOverviewPage.total).toHaveText(`Total: $${totals.total}`);

      await checkoutOverviewPage.finish();
      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutCompletePage.header).toHaveText(messages.orderComplete);
    },
  );

  for (const field of missingFieldCases) {
    test(
      `blocks checkout when ${field.name} is missing`,
      { tag: ['@regression'] },
      async ({ standardUserOnInventory, cartPage, checkoutInfoPage, page }) => {
        await standardUserOnInventory.add(products.backpack);
        await standardUserOnInventory.openCart();
        await cartPage.checkout();

        await checkoutInfoPage.enterCustomer(field.customer);
        await checkoutInfoPage.continue();

        await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
        await expect(checkoutInfoPage.error).toHaveText(field.error);
      },
    );
  }
});
