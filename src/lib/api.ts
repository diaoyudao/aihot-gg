import type { ItemsParams, ItemsResponse, DailyReport, DailiesResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aihot.virxact.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchAPI<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`API 请求失败: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function getItems(params?: ItemsParams): Promise<ItemsResponse> {
  return fetchAPI<ItemsResponse>('/api/public/items', params as Record<string, string | number | undefined>);
}

export function getLatestDaily(): Promise<DailyReport> {
  return fetchAPI<DailyReport>('/api/public/daily');
}

export function getDaily(date: string): Promise<DailyReport> {
  return fetchAPI<DailyReport>(`/api/public/daily/${date}`);
}

export function getDailies(take?: number): Promise<DailiesResponse> {
  return fetchAPI<DailiesResponse>('/api/public/dailies', { take });
}

/** 将原始 API 路径转为本地代理 URL */
function toProxyURL(path: string): string {
  const [basePath, qs] = path.split('?');
  return `/api/proxy?path=${encodeURIComponent(basePath)}${qs ? '&' + qs : ''}`;
}

// SWR fetcher — 通过本地 /api/proxy 避免 CORS
export const swrFetcher = (url: string) => {
  // 已经是代理 URL 的直接使用（来自 buildItemsURL）
  if (url.startsWith('/api/proxy')) {
    return fetch(url).then(r => {
      if (!r.ok) throw new Error(`API 请求失败: ${r.status}`);
      return r.json();
    });
  }
  // 原始 API 路径转为代理
  const finalUrl = url.startsWith('http') ? toProxyURL(new URL(url).pathname + (url.includes('?') ? url.slice(url.indexOf('?')) : '')) : toProxyURL(url);
  return fetch(finalUrl).then(r => {
    if (!r.ok) throw new Error(`API 请求失败: ${r.status}`);
    return r.json();
  });
};
