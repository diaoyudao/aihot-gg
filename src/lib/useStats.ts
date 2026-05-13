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
  count: number;
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

/** Hook: category trend over N days */
export function useCategoryTrend(days: 7 | 30) {
  const since = resolveSince(`now-${days}d`);
  const key = `/api/public/items?mode=all&since=${since}&take=500`;

  const { data, isLoading } = useSWR<ItemsResponse>(key, swrFetcher, {
    dedupingInterval: 300000,
  });

  const items = data?.items ?? [];
  return {
    data: aggregateByDateCategory(items),
    isLoading,
  };
}

/** Hook: source ranking */
export function useSourceRanking(days: 30) {
  const since = resolveSince(`now-${days}d`);
  const key = `/api/public/items?mode=all&since=${since}&take=500`;

  const { data, isLoading } = useSWR<ItemsResponse>(key, swrFetcher, {
    dedupingInterval: 300000,
  });

  const items = data?.items ?? [];
  return {
    data: aggregateBySource(items),
    isLoading,
  };
}

/** Hook: daily archive stats */
export function useDailyStats() {
  const { data, isLoading } = useSWR<DailiesResponse>(
    '/api/public/dailies?take=30',
    swrFetcher,
    { dedupingInterval: 300000 }
  );

  const items = data?.items ?? [];
  const dayCounts: DayCount[] = items.map(d => ({ date: d.date, count: 1 }));
  return { data: dayCounts, isLoading, raw: items };
}
