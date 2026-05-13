import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import type { NewsItem, ItemsResponse, DailiesResponse } from '@/lib/types';
import { resolveSince } from '@/lib/utils';

const CATEGORIES = ['ai-models', 'ai-products', 'industry', 'paper', 'tip'] as const;

export interface TrendRow {
  date: string;
  'ai-models': number;
  'ai-products': number;
  industry: number;
  paper: number;
  tip: number;
}

export interface SourceRank {
  name: string;
  count: number;
}

export interface DayCount {
  date: string;
  hasReport: boolean;
}

/** Aggregate items by date + category. Pure function. */
export function aggregateByDateCategory(items: NewsItem[]): TrendRow[] {
  const map = new Map<string, TrendRow>();

  for (const item of items) {
    if (!item.publishedAt || !item.category) continue;
    const date = item.publishedAt.slice(0, 10);
    if (!map.has(date)) {
      map.set(date, { date, 'ai-models': 0, 'ai-products': 0, industry: 0, paper: 0, tip: 0 });
    }
    const row = map.get(date)!;
    if (CATEGORIES.includes(item.category)) {
      row[item.category] += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/** Aggregate items by source count. Pure function. */
export function aggregateBySource(items: NewsItem[], limit = 15): SourceRank[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const name = item.source;
    map.set(name, (map.get(name) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Build proxy URL for items API */
function itemsProxyURL(params: Record<string, string | number | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `/api/proxy?path=${encodeURIComponent('/api/public/items')}&${qs}`;
}

/** Hook: category trend over N days (paginated fetch, up to 300 items) */
export function useCategoryTrend(days: 7 | 30) {
  const since = resolveSince(`now-${days}d`);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<ItemsResponse>(
    (pageIndex, prevPage) => {
      if (prevPage && !prevPage.hasNext) return null;
      if (pageIndex >= 3) return null; // max 3 pages = 300 items
      const cursor = pageIndex > 0 && prevPage?.nextCursor ? prevPage.nextCursor : undefined;
      return itemsProxyURL({ mode: 'all', since, take: 100, cursor });
    },
    swrFetcher,
    { dedupingInterval: 300000, revalidateFirstPage: false }
  );

  // Auto-fetch next pages
  if (data && size < 3 && data[data.length - 1]?.hasNext) {
    setSize(size + 1);
  }

  const items = data ? data.flatMap(page => page?.items ?? []) : [];
  return {
    data: aggregateByDateCategory(items),
    isLoading: isLoading || isValidating,
  };
}

/** Hook: source ranking (paginated fetch, up to 300 items) */
export function useSourceRanking(days: 30) {
  const since = resolveSince(`now-${days}d`);

  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite<ItemsResponse>(
    (pageIndex, prevPage) => {
      if (prevPage && !prevPage.hasNext) return null;
      if (pageIndex >= 3) return null;
      const cursor = pageIndex > 0 && prevPage?.nextCursor ? prevPage.nextCursor : undefined;
      return itemsProxyURL({ mode: 'all', since, take: 100, cursor });
    },
    swrFetcher,
    { dedupingInterval: 300000, revalidateFirstPage: false }
  );

  if (data && size < 3 && data[data.length - 1]?.hasNext) {
    setSize(size + 1);
  }

  const items = data ? data.flatMap(page => page?.items ?? []) : [];
  return {
    data: aggregateBySource(items),
    isLoading: isLoading || isValidating,
  };
}

/** Hook: daily archive stats */
export function useDailyStats() {
  const { data, isLoading } = useSWR<DailiesResponse>(
    `/api/proxy?path=${encodeURIComponent('/api/public/dailies')}&take=30`,
    swrFetcher,
    { dedupingInterval: 300000 }
  );

  const items = data?.items ?? [];
  const dayCounts: DayCount[] = items.map(d => ({ date: d.date, hasReport: true }));
  return { data: dayCounts, isLoading, raw: items };
}
