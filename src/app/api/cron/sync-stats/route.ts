import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { fetchAllProtocolStats } from '@/lib/fetch-stats';
import { saveProtocolStats } from '@/lib/snapshots';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await fetchAllProtocolStats();
    const fetchedAt = await saveProtocolStats(stats);
    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      fetchedAt: fetchedAt.toISOString(),
      count: stats.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
