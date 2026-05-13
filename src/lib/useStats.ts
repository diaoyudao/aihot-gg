import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import { useEffect } from 'react';
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

export function aggregateBySource(items: NewsItem[], limit = 15): SourceRank[] {
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.source, (map.get(item.source) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function itemsURL(since: string, cursor?: string): string {
  const params = new URLSearchParams({ path: '/api/public/items', mode: 'all', since, take: '100' });
  if (cursor) params.set('cursor', cursor);
  return `/api/proxy?${params}`;
}

const MAX_PAGES = 3;

function usePaginatedItems(since: string) {
  const swr = useSWRInfinite<ItemsResponse>(
    (pageIndex, prevPage) => {
      if (prevPage && !prevPage.hasNext) return null;
      if (pageIndex >= MAX_PAGES) return null;
      const cursor = pageIndex > 0 && prevPage?.nextCursor ? prevPage.nextCursor : undefined;
      return itemsURL(since, cursor);
    },
    swrFetcher,
    { dedupingInterval: 300000, revalidateFirstPage: false }
  );

  // Auto-fetch next page via useEffect (safe, no render-time side effect)
  useEffect(() => {
    if (swr.data && swr.size < MAX_PAGES && swr.data[swr.data.length - 1]?.hasNext) {
      swr.setSize(swr.size + 1);
    }
  }, [swr.data, swr.size, swr.setSize]);

  const items = swr.data ? swr.data.flatMap(page => page?.items ?? []) : [];
  return { items, isLoading: swr.isLoading || swr.isValidating };
}

export function useCategoryTrend(days: 7 | 30) {
  const since = resolveSince(`now-${days}d`);
  const { items, isLoading } = usePaginatedItems(since);
  return { data: aggregateByDateCategory(items), isLoading };
}

export function useSourceRanking(days: 7 | 30 = 30) {
  const since = resolveSince(`now-${days}d`);
  const { items, isLoading } = usePaginatedItems(since);
  return { data: aggregateBySource(items), isLoading };
}

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
