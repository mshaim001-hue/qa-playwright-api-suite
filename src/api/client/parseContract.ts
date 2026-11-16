type ContractSchema<T> = {
  safeParse: (
    data: unknown,
  ) => { success: true; data: T } | { success: false; error: { message: string } };
};

export function parseContract<T>(schema: ContractSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Response did not match the contract:\n${result.error.message}`);
  }
  return result.data;
}
