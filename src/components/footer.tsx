'use client';

import { Heart } from 'lucide-react';

import { sendDiscordNotification } from '@/lib/discord';
import { PROTOCOL_COLORS } from '@/lib/normalize';

export function Footer() {
  return (
    <footer className="mt-auto pt-10 text-center text-sm text-muted-foreground">
      <p className="inline-flex flex-wrap items-center justify-center gap-1.5">
        Made with
        <Heart
          className="size-3.5"
          style={{ color: PROTOCOL_COLORS.x402, fill: PROTOCOL_COLORS.x402 }}
          aria-hidden="true"
        />
        by{' '}
        <a
          href="https://x.com/shafu0x"
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline"
          onClick={() => {
            void sendDiscordNotification('someone clicked @shafu0x');
          }}
        >
          @shafu0x
        </a>
      </p>
    </footer>
  );
}
