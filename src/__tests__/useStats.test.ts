import { describe, it, expect } from 'vitest';
import { aggregateByDateCategory, aggregateBySource } from '@/lib/useStats';
import type { NewsItem } from '@/lib/types';

const MOCK_ITEMS: NewsItem[] = [
  {
    id: '1', title: 'GPT-5 发布', url: 'https://a.com/1', source: 'OpenAI Blog',
    publishedAt: '2026-05-13T08:00:00Z', category: 'ai-models',
  },
  {
    id: '2', title: 'Claude 4 上线', url: 'https://a.com/2', source: 'Anthropic Blog',
    publishedAt: '2026-05-13T10:00:00Z', category: 'ai-models',
  },
  {
    id: '3', title: 'AI 医疗产品', url: 'https://a.com/3', source: 'TechCrunch',
    publishedAt: '2026-05-13T12:00:00Z', category: 'ai-products',
  },
  {
    id: '4', title: 'Google 行业报告', url: 'https://a.com/4', source: 'TechCrunch',
    publishedAt: '2026-05-12T08:00:00Z', category: 'industry',
  },
  {
    id: '5', title: 'Transformer 论文', url: 'https://a.com/5', source: 'ArXiv',
    publishedAt: '2026-05-12T14:00:00Z', category: 'paper',
  },
  {
    id: '6', title: 'Prompt 技巧', url: 'https://a.com/6', source: 'OpenAI Blog',
    publishedAt: '2026-05-12T16:00:00Z', category: 'tip',
  },
  {
    id: '7', title: '无分类新闻', url: 'https://a.com/7', source: 'Reuters',
    publishedAt: '2026-05-13T09:00:00Z', category: null,
  },
];

describe('aggregateByDateCategory', () => {
  it('groups items by date and category', () => {
    const result = aggregateByDateCategory(MOCK_ITEMS);
    expect(result).toHaveLength(2); // 2 dates

    const may13 = result.find(r => r.date === '2026-05-13');
    expect(may13).toBeDefined();
    expect(may13!['ai-models']).toBe(2);
    expect(may13!['ai-products']).toBe(1);
    expect(may13!['industry']).toBe(0);
  });

  it('fills zero for missing categories', () => {
    const result = aggregateByDateCategory(MOCK_ITEMS);
    const may12 = result.find(r => r.date === '2026-05-12');
    expect(may12!['ai-models']).toBe(0);
    expect(may12!['ai-products']).toBe(0);
    expect(may12!['industry']).toBe(1);
    expect(may12!['paper']).toBe(1);
    expect(may12!['tip']).toBe(1);
  });

  it('ignores items without category', () => {
    const result = aggregateByDateCategory(MOCK_ITEMS);
    const may13 = result.find(r => r.date === '2026-05-13');
    // id:7 has null category, should not appear in any category count
    const total = may13!['ai-models'] + may13!['ai-products'] + may13!['industry'] + may13!['paper'] + may13!['tip'];
    expect(total).toBe(3); // only 3 categorized items on 05-13
  });

  it('returns empty array for empty input', () => {
    expect(aggregateByDateCategory([])).toEqual([]);
  });

  it('sorts results by date ascending', () => {
    const result = aggregateByDateCategory(MOCK_ITEMS);
    expect(result[0].date).toBe('2026-05-12');
    expect(result[1].date).toBe('2026-05-13');
  });
});

describe('aggregateBySource', () => {
  it('counts items per source', () => {
    const result = aggregateBySource(MOCK_ITEMS);
    const tc = result.find(r => r.name === 'TechCrunch');
    expect(tc?.count).toBe(2);

    const openai = result.find(r => r.name === 'OpenAI Blog');
    expect(openai?.count).toBe(2);
  });

  it('sorts by count descending', () => {
    const result = aggregateBySource(MOCK_ITEMS);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].count).toBeLessThanOrEqual(result[i - 1].count);
    }
  });

  it('respects limit parameter', () => {
    const result = aggregateBySource(MOCK_ITEMS, 2);
    expect(result).toHaveLength(2);
  });

  it('defaults to top 15', () => {
    const items: NewsItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: String(i), title: `Item ${i}`, url: `https://a.com/${i}`,
      source: `Source ${i}`, publishedAt: '2026-05-13T08:00:00Z',
    }));
    const result = aggregateBySource(items);
    expect(result).toHaveLength(15);
  });

  it('returns empty array for empty input', () => {
    expect(aggregateBySource([])).toEqual([]);
  });
});
