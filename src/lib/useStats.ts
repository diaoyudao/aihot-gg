import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import type { NewsItem, ItemsResponse, DailiesResponse } from '@/lib/types';

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

/** Filter items to last N days */
function filterByDays(items: NewsItem[], days: number): NewsItem[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString();
  return items.filter(item => item.publishedAt && item.publishedAt >= cutoffStr);
}

// Single shared fetch for all stats — mode=all, take=100 (max allowed)
const STATS_URL = `/api/proxy?path=${encodeURIComponent('/api/public/items')}&mode=all&take=100`;

function useAllItems() {
  const { data, isLoading } = useSWR<ItemsResponse>(
    'stats-all-items',
    () => swrFetcher(STATS_URL),
    { dedupingInterval: 300000 }
  );
  return { items: data?.items ?? [], isLoading };
}

export function useCategoryTrend(days: 7 | 30) {
  const { items, isLoading } = useAllItems();
  const filtered = filterByDays(items, days);
  return { data: aggregateByDateCategory(filtered), isLoading };
}

export function useSourceRanking(days: 7 | 30 = 30) {
  const { items, isLoading } = useAllItems();
  const filtered = filterByDays(items, days);
  return { data: aggregateBySource(filtered), isLoading };
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
