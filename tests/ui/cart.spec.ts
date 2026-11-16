import { products } from '../../src/ui/data/catalog';
import { expect, test } from '../../src/ui/fixtures/test';

test.describe('Cart', () => {
  test(
    'adds a backpack and shows it in the cart',
    { tag: ['@smoke', '@regression'] },
    async ({ standardUserOnInventory, cartPage, page }) => {
      await standardUserOnInventory.add(products.backpack);

      await expect(standardUserOnInventory.cartBadge).toHaveText('1');

      await standardUserOnInventory.openCart();

      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.itemNames).toHaveText([products.backpack]);
    },
  );

  test(
    'adds two products and shows both in the cart',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory, cartPage }) => {
      await standardUserOnInventory.add(products.backpack);
      await standardUserOnInventory.add(products.bikeLight);

      await expect(standardUserOnInventory.cartBadge).toHaveText('2');

      await standardUserOnInventory.openCart();

      await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
    },
  );

  test(
    'removes a product from the inventory page',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      await standardUserOnInventory.add(products.backpack);
      await expect(standardUserOnInventory.cartBadge).toHaveText('1');

      await standardUserOnInventory.remove(products.backpack);

      await expect(standardUserOnInventory.cartBadge).toHaveCount(0);
    },
  );

  test(
    'removes a product from the cart page',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory, cartPage }) => {
      await standardUserOnInventory.add(products.backpack);
      await standardUserOnInventory.openCart();

      await cartPage.remove(products.backpack);

      await expect(cartPage.itemNames).toHaveCount(0);
      await expect(cartPage.cartBadge).toHaveCount(0);
    },
  );
});
