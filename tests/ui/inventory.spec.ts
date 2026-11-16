import { sortOptions } from '../../src/ui/data/catalog';
import { expect, test } from '../../src/ui/fixtures/test';

test.describe('Inventory sorting', () => {
  test(
    'lists product names from A to Z by default',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      const names = await standardUserOnInventory.itemNames.allTextContents();
      const expected = [...names].sort((left, right) => left.localeCompare(right));

      expect(names.length).toBeGreaterThan(1);
      await expect(standardUserOnInventory.itemNames).toHaveText(expected);
    },
  );

  test(
    'sorts product names from Z to A',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      const names = await standardUserOnInventory.itemNames.allTextContents();
      const expected = [...names].sort((left, right) => right.localeCompare(left));

      await standardUserOnInventory.sortBy(sortOptions.nameDesc);

      await expect
        .poll(async () => standardUserOnInventory.itemNames.allTextContents())
        .toEqual(expected);
    },
  );

  test(
    'sorts product names back to A to Z',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      const names = await standardUserOnInventory.itemNames.allTextContents();
      const expected = [...names].sort((left, right) => left.localeCompare(right));

      await standardUserOnInventory.sortBy(sortOptions.nameDesc);
      await standardUserOnInventory.sortBy(sortOptions.nameAsc);

      await expect
        .poll(async () => standardUserOnInventory.itemNames.allTextContents())
        .toEqual(expected);
    },
  );

  test(
    'sorts prices from low to high',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      const prices = await standardUserOnInventory.prices();
      const expected = [...prices].sort((left, right) => left - right);

      await standardUserOnInventory.sortBy(sortOptions.priceAsc);

      await expect.poll(async () => standardUserOnInventory.prices()).toEqual(expected);
    },
  );

  test(
    'sorts prices from high to low',
    { tag: ['@regression'] },
    async ({ standardUserOnInventory }) => {
      const prices = await standardUserOnInventory.prices();
      const expected = [...prices].sort((left, right) => right - left);

      await standardUserOnInventory.sortBy(sortOptions.priceDesc);

      await expect.poll(async () => standardUserOnInventory.prices()).toEqual(expected);
    },
  );
});
