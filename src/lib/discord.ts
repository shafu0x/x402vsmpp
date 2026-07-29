'use server';

import { after } from 'next/server';

import { env } from '@/lib/env';

const DISCORD_AVATAR_URL = 'https://x402vsmpp.dev/icon';

export async function sendDiscordNotification(content: string): Promise<void> {
  after(async () => {
    try {
      const response = await fetch(env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: 'x402vsmpp',
          avatar_url: DISCORD_AVATAR_URL,
        }),
      });

      if (!response.ok) {
        console.error(`Discord webhook failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Discord webhook failed:', error);
    }
  });
}
