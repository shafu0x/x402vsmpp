import { ImageResponse } from 'next/og';

import { PROTOCOL_COLORS } from '@/lib/normalize';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0a0a',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, background: PROTOCOL_COLORS.x402 }} />
      <div style={{ flex: 1, background: PROTOCOL_COLORS.mpp }} />
    </div>,
    { ...size },
  );
}
