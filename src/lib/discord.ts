'use server';

import { after } from 'next/server';

import { env } from '@/lib/env';

const DISCORD_AVATAR_URL = 'https://x402vsmpp.dev/icon';

async function postToDiscordWebhook(webhookUrl: string, content: string): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
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
}

export async function sendDiscordNotification(content: string): Promise<void> {
  after(() => postToDiscordWebhook(env.DISCORD_NOTIFICATIONS_WEBHOOK_URL, content));
}

export async function sendDiscordAlert(content: string): Promise<void> {
  after(() => postToDiscordWebhook(env.DISCORD_ALERTS_WEBHOOK_URL, content));
}
