import { Suspense } from 'react';

import { Dashboard } from '@/components/dashboard';
import { PageHeader } from '@/components/page-header';
import { buildDashboardData } from '@/lib/dashboard-data';
import { getLatestSnapshotSet } from '@/lib/snapshots';

export const revalidate = 300;

export default async function HomePage() {
  const snapshot = await getLatestSnapshotSet();

  return (
    <main className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-6 py-10">
      {snapshot ? (
        <Suspense>
          <Dashboard panels={buildDashboardData(snapshot)}>
            <PageHeader />
          </Dashboard>
        </Suspense>
      ) : (
        <div className="flex flex-col gap-8">
          <PageHeader />
          <div className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
            <p>No snapshot data yet.</p>
            <p className="mt-2">
              Run <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">pnpm sync</code>{' '}
              while the dev server is running to fetch stats via AgentCash.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
