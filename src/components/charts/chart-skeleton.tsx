import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricCardSkeleton() {
  return (
    <Card className="border-border/60 bg-card/80" aria-hidden="true">
      <CardHeader className="gap-1 p-4 pb-1">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <Skeleton className="mx-auto h-40 w-full max-w-42" />
      </CardContent>
    </Card>
  );
}
