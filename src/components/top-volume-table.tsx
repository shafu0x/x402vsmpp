'use client';

import { ArrowLeftRight, DollarSign, Globe, Server, Users, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAddress, formatCount, formatVolume } from '@/lib/format';
import { PROTOCOL_COLORS } from '@/lib/normalize';
import type { TopVolumeEntry } from '@/lib/types';

type TopVolumeTableProps = {
  entries: TopVolumeEntry[];
};

const TABLE_COLUMNS = [
  {
    key: 'server',
    label: 'Server',
    icon: Server,
    className: 'text-left',
    align: 'left' as const,
  },
  {
    key: 'volume',
    label: 'Volume',
    icon: DollarSign,
    className: 'w-32 text-center whitespace-nowrap',
    align: 'center' as const,
  },
  {
    key: 'txns',
    label: 'Txns',
    icon: ArrowLeftRight,
    className: 'w-28 text-center whitespace-nowrap',
    align: 'center' as const,
  },
  {
    key: 'buyers',
    label: 'Buyers',
    icon: Users,
    className: 'w-28 text-center whitespace-nowrap',
    align: 'center' as const,
  },
  {
    key: 'chain',
    label: 'Chain',
    icon: Globe,
    className: 'w-20 text-center whitespace-nowrap',
    align: 'center' as const,
  },
] as const;

const MOBILE_METRICS = [
  {
    key: 'volume',
    label: 'volume',
    icon: DollarSign,
    format: formatVolume,
    getValue: (entry: TopVolumeEntry) => entry.volume,
  },
  {
    key: 'txns',
    label: 'txs',
    icon: ArrowLeftRight,
    format: formatCount,
    getValue: (entry: TopVolumeEntry) => entry.transactions,
  },
  {
    key: 'buyers',
    label: 'buyers',
    icon: Users,
    format: formatCount,
    getValue: (entry: TopVolumeEntry) => entry.buyers,
  },
] as const;

function ColumnHeader({
  label,
  icon: Icon,
  className,
  align,
}: {
  label: string;
  icon: LucideIcon;
  className?: string;
  align: 'left' | 'center';
}) {
  return (
    <TableHead scope="col" className={className}>
      <span
        className={`inline-flex w-full items-center gap-1.5 ${align === 'center' ? 'justify-center' : 'justify-start'}`}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {label}
      </span>
    </TableHead>
  );
}

function ServiceIcon({ entry }: { entry: TopVolumeEntry }) {
  const [failed, setFailed] = useState(false);

  if (entry.protocol === 'x402') {
    return null;
  }

  const initial = entry.name.slice(0, 1).toUpperCase();

  if (entry.protocol === 'mpp' && entry.logoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- third-party favicons; avoid remotePatterns churn
      <img
        src={entry.logoUrl}
        width={20}
        height={20}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="size-5 shrink-0 rounded-sm"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold text-background"
      style={{ backgroundColor: PROTOCOL_COLORS[entry.protocol] }}
    >
      {initial}
    </span>
  );
}

function getDisplayName(entry: TopVolumeEntry): { label: string; title: string } {
  if (entry.protocol === 'x402' && entry.href) {
    const recipient = entry.href.split('/recipient/').at(-1);
    if (recipient?.startsWith('0x')) {
      return { label: formatAddress(recipient), title: recipient };
    }
  }

  return { label: entry.name, title: entry.name };
}

function EntryName({ entry }: { entry: TopVolumeEntry }) {
  const { label, title } = getDisplayName(entry);

  const content = (
    <span className="min-w-0 truncate font-mono text-xs" title={title} translate="no">
      {label}
    </span>
  );

  if (!entry.href) return content;

  return (
    <a
      href={entry.href}
      target="_blank"
      rel="noopener noreferrer"
      className="min-w-0 truncate font-mono text-xs text-foreground underline-offset-4 hover:underline"
      title={title}
      translate="no"
    >
      {label}
    </a>
  );
}

const CHAIN_ICON_CONFIG = {
  tempo: {
    icon: '/chains/tempo.png',
    wordmark: '/chains/tempo-wordmark-white.svg',
    label: 'Tempo',
    wordmarkClassName: 'block h-3 w-auto max-w-14 shrink-0 object-contain',
  },
  base: {
    icon: '/chains/base.svg',
    wordmark: '/chains/base-wordmark-blue.svg',
    label: 'Base',
    wordmarkClassName: 'block h-3 w-auto max-w-10 shrink-0 object-contain',
  },
  solana: {
    icon: '/chains/solana.svg',
    wordmark: '/chains/solana.svg',
    label: 'Solana',
    wordmarkClassName: 'block size-4 shrink-0 object-contain',
  },
} as const;

type ChainIconKey = keyof typeof CHAIN_ICON_CONFIG;

function ChainIcons({
  chains,
  variant = 'icon',
}: {
  chains: string | null;
  variant?: 'icon' | 'wordmark';
}) {
  if (!chains) {
    return <span className="text-muted-foreground">—</span>;
  }

  const keys = chains
    .split(',')
    .map((chain) => chain.trim())
    .filter((chain): chain is ChainIconKey => chain in CHAIN_ICON_CONFIG);

  if (keys.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      {keys.map((key) => {
        const config = CHAIN_ICON_CONFIG[key];
        const src = variant === 'wordmark' ? config.wordmark : config.icon;
        const className = variant === 'wordmark' ? config.wordmarkClassName : 'size-5 shrink-0';

        return (
          // eslint-disable-next-line @next/next/no-img-element -- local static chain logos
          <img
            key={key}
            src={src}
            {...(variant === 'icon' ? { width: 20, height: 20 } : {})}
            alt={config.label}
            title={config.label}
            className={className}
          />
        );
      })}
    </div>
  );
}

const emptyMessage = (
  <p className="text-sm text-muted-foreground">
    No leaderboard data yet. Run{' '}
    <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">pnpm sync</code>.
  </p>
);

export function TopVolumeTable({ entries }: TopVolumeTableProps) {
  if (entries.length === 0) {
    return (
      <>
        <div className="flex flex-col gap-3 md:hidden">
          <h2 className="text-base font-semibold text-foreground">Top 5 Services</h2>
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-4">{emptyMessage}</CardContent>
          </Card>
        </div>
        <Card className="hidden border-border/60 bg-card/80 md:block">
          <CardContent className="p-4">{emptyMessage}</CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="hidden border-border/60 bg-card/80 md:block">
        <CardContent className="p-4 pt-1">
          <Table>
            <TableCaption className="sr-only">Top 5 Services</TableCaption>
            <TableHeader>
              <TableRow>
                {TABLE_COLUMNS.map(({ key, label, icon, className, align }) => (
                  <ColumnHeader
                    key={key}
                    label={label}
                    icon={icon}
                    className={className}
                    align={align}
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={`${entry.protocol}-${entry.rank}-${entry.name}`}>
                  <TableCell className="max-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <ServiceIcon entry={entry} />
                      <EntryName entry={entry} />
                    </div>
                  </TableCell>
                  <TableCell className="w-32 text-center tabular-nums whitespace-nowrap">
                    {formatVolume(entry.volume)}
                  </TableCell>
                  <TableCell className="w-28 text-center tabular-nums whitespace-nowrap">
                    {formatCount(entry.transactions)}
                  </TableCell>
                  <TableCell className="w-28 text-center tabular-nums whitespace-nowrap">
                    {formatCount(entry.buyers)}
                  </TableCell>
                  <TableCell className="w-20 text-center">
                    <div className="flex justify-center">
                      <ChainIcons chains={entry.chains} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 md:hidden">
        <h2 className="text-base font-semibold text-foreground">Top 5 Services</h2>
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={`${entry.protocol}-${entry.rank}-${entry.name}`}
              className="rounded-xl border border-border/60 bg-card/80 p-4"
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex min-w-0 max-w-full items-center gap-2">
                  {entry.protocol === 'mpp' ? (
                    <span
                      className="flex size-5 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <ServiceIcon entry={entry} />
                    </span>
                  ) : null}
                  <EntryName entry={entry} />
                </div>
                <div className="grid w-full grid-cols-4 items-start gap-2">
                  {MOBILE_METRICS.map(({ key, label, icon: Icon, format, getValue }) => (
                    <div key={key} className="flex flex-col gap-0.5">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        {label}
                      </span>
                      <span className="flex h-5 items-center text-sm tabular-nums text-foreground">
                        {format(getValue(entry))}
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="size-3.5 shrink-0" aria-hidden="true" />
                      chain
                    </span>
                    <div className="flex h-5 items-center">
                      <ChainIcons chains={entry.chains} variant="wordmark" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
