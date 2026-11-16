import type { APIResponse } from '@playwright/test';

export async function readJson(response: APIResponse): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown parse error';
    throw new Error(
      `Expected JSON from ${response.url()} (HTTP ${response.status()}): ${message}. Body: ${text.slice(0, 300)}`,
      { cause: error },
    );
  }
}
