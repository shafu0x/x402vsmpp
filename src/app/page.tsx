import { Dashboard } from '@/components/dashboard';
import { Footer } from '@/components/footer';
import { PageHeader } from '@/components/page-header';
import { buildDashboardData } from '@/lib/dashboard-data';
import { getLatestSnapshotSet } from '@/lib/snapshots';

export default async function HomePage() {
  const snapshot = await getLatestSnapshotSet();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10">
      <Dashboard panels={buildDashboardData(snapshot)}>
        <PageHeader />
      </Dashboard>
      <Footer />
    </main>
  );
}
