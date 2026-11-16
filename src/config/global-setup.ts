import { rm } from 'node:fs/promises';

export default async function globalSetup(): Promise<void> {
  await rm('allure-results', { recursive: true, force: true });
}
