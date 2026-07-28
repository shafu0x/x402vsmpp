import { wrapFetchWithPayment, x402Client } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm';
import { createSIWxClientExtension } from '@x402/extensions/sign-in-with-x';
import { privateKeyToAccount } from 'viem/accounts';

import { env } from '@/lib/env';

const account = privateKeyToAccount(env.X402_PRIVATE_KEY as `0x${string}`);

const client = new x402Client()
  .register('eip155:8453', new ExactEvmScheme(account))
  .registerExtension(createSIWxClientExtension({ signers: [account] }));

const paidFetch = wrapFetchWithPayment(fetch, client);

export async function jsonFetch<T>(url: string): Promise<T> {
  const response = await paidFetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
