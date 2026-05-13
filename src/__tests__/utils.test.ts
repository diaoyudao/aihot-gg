import { describe, it, expect, vi, beforeEach } from 'vitest';
import { relativeTime, categoryLabel, buildItemsURL, resolveSince } from '@/lib/utils';

describe('relativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-13T12:00:00Z'));
  });

  it('returns 刚刚 for <1 minute ago', () => {
    expect(relativeTime('2026-05-13T11:59:30Z')).toBe('刚刚');
  });

  it('returns X分钟前 for <60 minutes', () => {
    expect(relativeTime('2026-05-13T11:30:00Z')).toBe('30分钟前');
  });

  it('returns X小时前 for <24 hours', () => {
    expect(relativeTime('2026-05-13T08:00:00Z')).toBe('4小时前');
  });

  it('returns X天前 for <7 days', () => {
    expect(relativeTime('2026-05-11T12:00:00Z')).toBe('2天前');
  });

  it('returns M/D HH:mm for <30 days', () => {
    // relativeTime uses local time for display, so construct a local-time string
    const d = new Date('2026-05-13T12:00:00Z');
    d.setDate(d.getDate() - 23); // 23 days ago
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    expect(relativeTime(d.toISOString())).toBe(`${month}/${day} ${h}:${m}`);
  });

  it('returns YYYY/M/D for >=30 days', () => {
    const d = new Date('2026-05-13T12:00:00Z');
    d.setDate(d.getDate() - 45);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    expect(relativeTime(d.toISOString())).toBe(`${year}/${month}/${day}`);
  });

  it('returns 刚刚 for future time', () => {
    expect(relativeTime('2026-05-13T13:00:00Z')).toBe('刚刚');
  });
});

describe('categoryLabel', () => {
  it('maps known categories to Chinese labels', () => {
    expect(categoryLabel('ai-models')).toBe('模型');
    expect(categoryLabel('ai-products')).toBe('产品');
    expect(categoryLabel('industry')).toBe('行业');
    expect(categoryLabel('paper')).toBe('论文');
    expect(categoryLabel('tip')).toBe('技巧');
  });

  it('returns 其他 for null/undefined', () => {
    expect(categoryLabel(null)).toBe('其他');
    expect(categoryLabel(undefined)).toBe('其他');
  });

  it('returns raw string for unknown category', () => {
    expect(categoryLabel('unknown')).toBe('unknown');
  });
});

describe('buildItemsURL', () => {
  it('builds proxy URL with required params', () => {
    const url = buildItemsURL({ mode: 'all', take: 30 });
    expect(url).toContain('/api/proxy?path=');
    expect(url).toContain('mode=all');
    expect(url).toContain('take=30');
  });

  it('omits undefined and empty values', () => {
    const url = buildItemsURL({ mode: 'all', take: 30, q: undefined, category: '' });
    expect(url).not.toContain('q=');
    expect(url).not.toContain('category=');
  });

  it('includes optional params when provided', () => {
    const url = buildItemsURL({ mode: 'selected', take: 10, category: 'ai-models', q: 'GPT' });
    expect(url).toContain('category=ai-models');
    expect(url).toContain('q=GPT');
  });
});

describe('resolveSince', () => {
  it('converts now-24h to ISO date', () => {
    const result = resolveSince('now-24h');
    const d = new Date(result);
    expect(d.getTime()).toBeLessThan(Date.now());
    expect(d.getTime()).toBeGreaterThan(Date.now() - 25 * 3600000);
  });

  it('converts now-7d to ISO date', () => {
    const result = resolveSince('now-7d');
    const d = new Date(result);
    expect(d.getTime()).toBeLessThan(Date.now());
    expect(d.getTime()).toBeGreaterThan(Date.now() - 8 * 86400000);
  });

  it('passes through non-relative values', () => {
    expect(resolveSince('2026-05-06T00:00:00Z')).toBe('2026-05-06T00:00:00Z');
  });
});
