import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';
import { fetchCombinedTopVolume } from '@/lib/fetch-leaderboard';
import { fetchAllProtocolStats } from '@/lib/fetch-stats';
import { saveLeaderboardEntries, saveProtocolStats } from '@/lib/snapshots';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [stats, topVolume] = await Promise.all([
      fetchAllProtocolStats(),
      fetchCombinedTopVolume(),
    ]);
    const fetchedAt = new Date();
    await Promise.all([
      saveProtocolStats(stats, fetchedAt),
      saveLeaderboardEntries(topVolume, fetchedAt),
    ]);
    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      fetchedAt: fetchedAt.toISOString(),
      count: stats.length,
      leaderboardCount: topVolume.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
