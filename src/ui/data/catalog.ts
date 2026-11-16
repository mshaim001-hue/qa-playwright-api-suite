export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

export const sortOptions = {
  nameAsc: 'az',
  nameDesc: 'za',
  priceAsc: 'lohi',
  priceDesc: 'hilo',
} as const;

export type SortOption = (typeof sortOptions)[keyof typeof sortOptions];
