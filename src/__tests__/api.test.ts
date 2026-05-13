import { describe, it, expect, vi, beforeEach } from 'vitest';
import { swrFetcher } from '@/lib/api';

describe('swrFetcher', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses proxy URL directly for /api/proxy paths', async () => {
    const mockResponse = { items: [] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }));

    const result = await swrFetcher('/api/proxy?path=%2Fapi%2Fpublic%2Fitems&mode=all');
    expect(fetch).toHaveBeenCalledWith('/api/proxy?path=%2Fapi%2Fpublic%2Fitems&mode=all');
    expect(result).toEqual(mockResponse);
  });

  it('converts raw API path to proxy URL', async () => {
    const mockResponse = { date: '2026-05-13' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }));

    const result = await swrFetcher('/api/public/daily');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/proxy?path='));
    expect(result).toEqual(mockResponse);
  });

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));

    await expect(swrFetcher('/api/proxy?path=test')).rejects.toThrow('API 请求失败');
  });
});
