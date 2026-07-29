import { jsonFetch } from '@/lib/paid-fetch';
import {
  normalizeMppService,
  normalizeX402Merchant,
  type MppServiceResponse,
  type X402MerchantResponse,
} from '@/lib/normalize';
import type { Timeframe, TopVolumeEntry } from '@/lib/types';

const TIMEFRAMES: Timeframe[] = [1, 7, 30];
export const TOP_VOLUME_LIMIT = 5;
const PAGE_SIZE = TOP_VOLUME_LIMIT;
const TOP_N = TOP_VOLUME_LIMIT;

type MppServicesListResponse = {
  data: MppServiceResponse[];
};

type X402MerchantsListResponse = {
  data: X402MerchantResponse[];
};

async function fetchMppTopServices(timeframe: Timeframe) {
  const data = await jsonFetch<MppServicesListResponse>(
    `https://mppscan.com/api/mpp/services?page_size=${PAGE_SIZE}&timeframe=${timeframe}&sort=total_amount&order=desc`,
  );

  return data.data
    .toSorted((a, b) => b.stats.volume - a.stats.volume)
    .map((service) => normalizeMppService(timeframe, service));
}

async function fetchX402TopMerchants(timeframe: Timeframe) {
  const data = await jsonFetch<X402MerchantsListResponse>(
    `https://x402scan.com/api/x402/merchants?page_size=${PAGE_SIZE}&timeframe=${timeframe}&sort_by=volume`,
  );

  return data.data.map((merchant) => normalizeX402Merchant(timeframe, merchant));
}

function mergeTopVolume(
  timeframe: Timeframe,
  mpp: Awaited<ReturnType<typeof fetchMppTopServices>>,
  x402: Awaited<ReturnType<typeof fetchX402TopMerchants>>,
): TopVolumeEntry[] {
  return [...mpp, ...x402]
    .toSorted((a, b) => b.volume - a.volume)
    .slice(0, TOP_N)
    .map((entry, index) => ({
      ...entry,
      timeframe,
      rank: index + 1,
    }));
}

export async function fetchCombinedTopVolume(): Promise<TopVolumeEntry[]> {
  const perTimeframe = await Promise.all(
    TIMEFRAMES.map(async (timeframe) => {
      const [mpp, x402] = await Promise.all([
        fetchMppTopServices(timeframe),
        fetchX402TopMerchants(timeframe),
      ]);
      return mergeTopVolume(timeframe, mpp, x402);
    }),
  );

  return perTimeframe.flat();
}
